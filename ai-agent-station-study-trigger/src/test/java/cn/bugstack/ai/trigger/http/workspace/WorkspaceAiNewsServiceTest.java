package cn.bugstack.ai.trigger.http.workspace;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

class WorkspaceAiNewsServiceTest {

    private final WorkspaceAiNewsService service = new WorkspaceAiNewsService(
            mock(WorkspaceAgentClientResolver.class), new ObjectMapper());

    @Test
    void parsesDocumentedSelectedIndicesSchema() {
        assertEquals(List.of(2, 4, 1, 5, 3), service.parseSelectedIndices(
                "```json\n{\"selectedIndices\":[2,4,1,5,3],\"reason\":\"impact\"}\n```", 10, 5));
    }

    @Test
    void parsesObservedSelectedEventsSchemaWithoutTrustingOtherFields() {
        String response = "{\"total_selected\":5,\"selected_events\":["
                + "{\"index\":1},{\"index\":3},{\"index\":5},{\"index\":7},{\"index\":9}]}";

        assertEquals(List.of(1, 3, 5, 7, 9), service.parseSelectedIndices(response, 10, 5));
    }

    @Test
    void rejectsDuplicateOrOutOfRangeSelections() {
        assertThrows(IllegalStateException.class, () -> service.parseSelectedIndices(
                "{\"selected_events\":[{\"index\":1},{\"index\":1},{\"index\":99}]}", 10, 5));
    }

    @Test
    void rejectsCuratorResponseWhenTopicEvidenceIsInsufficient() {
        assertThrows(IllegalStateException.class, () -> service.parseSelectedIndices(
                "{\"insufficientEvidence\":true,\"selectedIndices\":[],\"reason\":\"unrelated results\"}", 10, 5));
    }

    @Test
    void parsesStructuredMcpResultsWithoutRewritingOriginalMetadata() {
        String response = """
                {"results":[{"url":"https://finance.example.com/gold","title":"黄金期货创下新高",
                "content":"COMEX 黄金期货上涨。","published_date":"Tue, 18 Aug 2026 02:11:35 GMT"}]}
                """;

        List<WorkspaceAiNewsService.NewsEvent> events = service.parseSearchResults(response);

        assertEquals(1, events.size());
        assertEquals("黄金期货创下新高", events.get(0).title());
        assertEquals("https://finance.example.com/gold", events.get(0).originalUrl());
        assertEquals("finance.example.com", events.get(0).publisher());
        assertEquals("COMEX 黄金期货上涨。", events.get(0).summary());
        assertEquals(Instant.parse("2026-08-18T02:11:35Z"), events.get(0).publishedAt());
    }

    @Test
    void derivesASecondSearchQueryFromGenericResearchWording() {
        assertEquals(List.of("黄金期货现状与趋势", "黄金期货"),
                service.researchQueries("黄金期货现状与趋势"));
        assertEquals(List.of("PostgreSQL 18"), service.researchQueries("PostgreSQL 18"));
    }
}
