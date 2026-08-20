package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

@Service
public class CsdnWorkspaceBlogPublisher implements WorkspaceBlogPublisher {

    private static final Parser MARKDOWN_PARSER = Parser.builder().build();
    private static final HtmlRenderer HTML_RENDERER = HtmlRenderer.builder().build();

    private final ObjectMapper objectMapper;
    private final Path credentialsFile;
    private final String apiUrl;
    private final RestClient restClient;

    public CsdnWorkspaceBlogPublisher(ObjectMapper objectMapper,
                                      @Value("${WORKSPACE_CSDN_CREDENTIALS_FILE:}") String credentialsFile,
                                      @Value("${WORKSPACE_CSDN_API_URL:https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle}") String apiUrl) {
        this.objectMapper = objectMapper;
        this.credentialsFile = StringUtils.hasText(credentialsFile)
                ? Path.of(credentialsFile).toAbsolutePath().normalize()
                : null;
        this.apiUrl = apiUrl;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public String target() {
        return "CSDN";
    }

    @Override
    public boolean isConfigured() {
        return credentialsFile != null && Files.isRegularFile(credentialsFile);
    }

    @Override
    public Publication publish(PublishRequest request) {
        Credentials credentials = loadCredentials();
        String category = StringUtils.hasText(request.category()) ? request.category().trim() : credentials.category();
        String mode = StringUtils.hasText(request.mode()) ? request.mode().trim().toUpperCase() : "DRAFT";
        if (!"DRAFT".equals(mode) && !"PUBLIC".equals(mode)) {
            throw new IllegalArgumentException("CSDN publishing mode must be DRAFT or PUBLIC");
        }
        boolean publicPublication = "PUBLIC".equals(mode);
        CsdnArticleRequest body = new CsdnArticleRequest(
                request.title(), request.markdown(), HTML_RENDERER.render(MARKDOWN_PARSER.parse(request.markdown())),
                "public", "0", String.join(",", request.tags()), publicPublication ? 0 : 2,
                category, "original", "", false,
                request.summary(), "", "0", "pc_mdeditor", List.of(), 0, 1, 0, "", "draft", 0);
        body = body.withPubStatus(publicPublication ? "publish" : "draft");

        CsdnArticleResponse response = restClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.ACCEPT, "*/*")
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.COOKIE, credentials.cookie())
                .header(HttpHeaders.ORIGIN, "https://editor.csdn.net")
                .header(HttpHeaders.REFERER, "https://editor.csdn.net/")
                .header(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/134.0.0.0 Safari/537.36")
                .header("x-ca-key", "203803574")
                .header("x-ca-nonce", "a70ca99e-8bfa-46d1-8d12-363c72707ebe")
                .header("x-ca-signature", "NGLzlIyvH7BuQgGJrgfGOzao0SVpzdTs4aTcw3hio6Y=")
                .header("x-ca-signature-headers", "x-ca-key,x-ca-nonce")
                .body(body)
                .retrieve()
                .body(CsdnArticleResponse.class);

        if (response == null || response.code() == null || response.code() != 200 || response.data() == null) {
            String message = response == null ? "empty response" : response.message();
            throw new IllegalStateException("CSDN rejected the draft: " + message);
        }
        return new Publication(target(), mode, String.valueOf(response.data().id()),
                response.data().url(), Instant.now());
    }

    private Credentials loadCredentials() {
        if (!isConfigured()) {
            throw new IllegalStateException("CSDN publishing credentials are not configured");
        }
        try {
            Credentials credentials = objectMapper.readValue(credentialsFile.toFile(), Credentials.class);
            if (!StringUtils.hasText(credentials.cookie())) {
                throw new IllegalStateException("CSDN publishing credentials do not contain a cookie");
            }
            return credentials;
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read CSDN publishing credentials", e);
        }
    }

    record Credentials(String username, String category, String cookie) {
    }

    record CsdnArticleRequest(String title, String markdowncontent, String content, String readType,
                              String level, String tags, Integer status, String categories, String type,
                              String original_link, Boolean authorized_status,
                              @JsonProperty("Description") String description, String resource_url,
                              String not_auto_saved, String source, List<String> cover_images,
                              Integer cover_type, Integer is_new, Integer vote_id, String resource_id,
                              String pubStatus, Integer sync_git_code) {
        CsdnArticleRequest withPubStatus(String value) {
            return new CsdnArticleRequest(title, markdowncontent, content, readType, level, tags, status,
                    categories, type, original_link, authorized_status, description, resource_url,
                    not_auto_saved, source, cover_images, cover_type, is_new, vote_id, resource_id,
                    value, sync_git_code);
        }
    }

    record CsdnArticleResponse(Integer code, String msg, CsdnArticleData data) {
        String message() {
            return StringUtils.hasText(msg) ? msg : "unknown error";
        }
    }

    record CsdnArticleData(Long id, String url, String title, String description) {
    }
}
