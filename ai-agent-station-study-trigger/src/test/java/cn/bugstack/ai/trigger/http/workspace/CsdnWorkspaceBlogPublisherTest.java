package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CsdnWorkspaceBlogPublisherTest {

    @TempDir
    Path directory;

    @Test
    void publishesAPrivateDraftWithoutExposingCredentialsInThePayload() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        Path credentials = directory.resolve("csdn.json");
        Files.writeString(credentials, """
                {"username":"demo","category":"AI","cookie":"UserName=demo; UserToken=secret"}
                """);
        AtomicReference<String> requestBody = new AtomicReference<>();
        AtomicReference<String> cookieHeader = new AtomicReference<>();
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/saveArticle", exchange -> {
            requestBody.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            cookieHeader.set(exchange.getRequestHeaders().getFirst("Cookie"));
            byte[] response = """
                    {"code":200,"msg":"success","data":{"id":123,"url":"https://blog.csdn.net/demo/article/details/123","title":"Title"}}
                    """.getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            exchange.getResponseBody().write(response);
            exchange.close();
        });
        server.start();
        try {
            CsdnWorkspaceBlogPublisher publisher = new CsdnWorkspaceBlogPublisher(objectMapper,
                    credentials.toString(), "http://127.0.0.1:" + server.getAddress().getPort() + "/saveArticle");

            WorkspaceBlogPublisher.Publication publication = publisher.publish(
                    new WorkspaceBlogPublisher.PublishRequest("Title", "Summary", "# Body", List.of("AI"), null, "DRAFT"));

            JsonNode sent = objectMapper.readTree(requestBody.get());
            assertEquals("draft", sent.get("pubStatus").asText());
            assertEquals(2, sent.get("status").asInt());
            assertEquals("<h1>Body</h1>\n", sent.get("content").asText());
            assertTrue(cookieHeader.get().contains("UserToken=secret"));
            assertEquals("CSDN", publication.target());
            assertEquals("DRAFT", publication.mode());
            assertEquals("123", publication.externalId());
        } finally {
            server.stop(0);
        }
    }
}
