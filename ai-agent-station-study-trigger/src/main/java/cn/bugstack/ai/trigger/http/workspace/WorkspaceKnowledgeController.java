package cn.bugstack.ai.trigger.http.workspace;

import cn.bugstack.ai.api.response.Response;
import cn.bugstack.ai.types.enums.ResponseCode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/workspace")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {})
public class WorkspaceKnowledgeController {

    private final WorkspaceKnowledgeService knowledgeService;
    private final WorkspaceDiffReviewService diffReviewService;
    private final WorkspaceMemoryService memoryService;

    public WorkspaceKnowledgeController(WorkspaceKnowledgeService knowledgeService,
                                        WorkspaceDiffReviewService diffReviewService,
                                        WorkspaceMemoryService memoryService) {
        this.knowledgeService = knowledgeService;
        this.diffReviewService = diffReviewService;
        this.memoryService = memoryService;
    }

    @PostMapping(value = "/{workspaceId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response<WorkspaceKnowledgeService.ImportResult> importDocuments(@PathVariable("workspaceId") String workspaceId,
                                                                              @RequestPart("files") List<MultipartFile> files) {
        return success(knowledgeService.importDocuments(workspaceId, files));
    }

    @GetMapping("/{workspaceId}/search")
    public Response<List<WorkspaceKnowledgeService.SearchResult>> search(@PathVariable("workspaceId") String workspaceId,
                                                                           @RequestParam("query") String query,
                                                                           @RequestParam(value = "limit", defaultValue = "8") int limit) {
        return success(knowledgeService.hybridSearch(workspaceId, query, limit));
    }

    @GetMapping("/{workspaceId}/summary")
    public Response<Map<String, Object>> summary(@PathVariable("workspaceId") String workspaceId) {
        return success(Map.of("workspaceId", workspaceId, "chunkCount", knowledgeService.documentCount(workspaceId)));
    }

    @PostMapping("/{workspaceId}/reviews/diff")
    public Response<WorkspaceDiffReviewService.DiffReviewResult> reviewDiff(@PathVariable("workspaceId") String workspaceId,
                                                                              @RequestBody DiffReviewRequest request) {
        return success(diffReviewService.review(request.diffBase64(), request.diff()));
    }

    @GetMapping("/{workspaceId}/memory/{sessionId}")
    public Response<WorkspaceMemoryService.SessionMemory> memory(@PathVariable("workspaceId") String workspaceId,
                                                                  @PathVariable("sessionId") String sessionId) {
        return success(memoryService.load(workspaceId, sessionId));
    }

    @PostMapping("/{workspaceId}/memory/{sessionId}/messages")
    public Response<WorkspaceMemoryService.SessionMemory> remember(@PathVariable("workspaceId") String workspaceId,
                                                                     @PathVariable("sessionId") String sessionId,
                                                                     @RequestBody MemoryMessageRequest request) {
        return success(memoryService.remember(workspaceId, sessionId, request.role(), request.content()));
    }

    @PostMapping("/{workspaceId}/memory/{sessionId}/facts")
    public Response<WorkspaceMemoryService.SessionMemory> addFacts(@PathVariable("workspaceId") String workspaceId,
                                                                     @PathVariable("sessionId") String sessionId,
                                                                     @RequestBody MemoryFactsRequest request) {
        return success(memoryService.addFacts(workspaceId, sessionId, request.facts()));
    }

    private <T> Response<T> success(T data) {
        return Response.<T>builder()
                .code(ResponseCode.SUCCESS.getCode())
                .info(ResponseCode.SUCCESS.getInfo())
                .data(data)
                .build();
    }

    public record DiffReviewRequest(String diffBase64, String diff) {
    }

    public record MemoryMessageRequest(String role, String content) {
    }

    public record MemoryFactsRequest(List<String> facts) {
    }
}
