package cn.bugstack.ai.trigger.http.workspace;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiWorkspaceBlogWriter implements WorkspaceBlogWriter {

    private static final String SYSTEM_PROMPT = """
            You are a technical blog editor. Write accurate, useful Markdown based on the supplied evidence.
            Never invent project behavior, measurements, or implementation details. Cite evidence with [1], [2],
            and so on immediately after the supported statement. If evidence is absent, clearly mark the relevant
            passage as general guidance instead of presenting it as a fact about the project. Return Markdown only,
            without a surrounding code fence. Start with one H1 heading and use concise sections and examples.
            For news roundups, preserve every supplied original URL and publication timestamp exactly as given.
            """;

    private final WorkspaceAgentClientResolver clientResolver;

    public AiWorkspaceBlogWriter(WorkspaceAgentClientResolver clientResolver) {
        this.clientResolver = clientResolver;
    }

    @Override
    public String write(WriteRequest request) {
        String prompt = """
                Topic: %s
                Audience: %s
                Tone: %s
                Target length: about %d Chinese characters or English words

                Evidence:
                %s

                Write the complete article now. Add a final section named \"Sources\" listing only the evidence
                actually cited in the article.
                """.formatted(request.topic(), request.audience(), request.tone(), request.targetLength(), request.evidence());

        return callWriter(prompt);
    }

    @Override
    public String revise(RevisionRequest request) {
        String prompt = """
                Revise the draft below using the inspector feedback. Preserve accurate citations and useful details.
                Return the complete replacement article as Markdown only.

                Topic: %s
                Audience: %s
                Tone: %s
                Target length: about %d Chinese characters or English words

                Evidence:
                %s

                Current draft:
                %s

                Inspector feedback:
                %s
                """.formatted(request.topic(), request.audience(), request.tone(), request.targetLength(),
                request.evidence(), request.currentContent(), request.feedback());
        return callWriter(prompt);
    }

    private String callWriter(String prompt) {
        WorkspaceAgentClientResolver.ResolvedClient client = clientResolver.resolveClient(
                "PRECISION_EXECUTOR_CLIENT", "EXECUTOR_CLIENT", "DEFAULT");
        String content = client.chatClient().prompt()
                .system(client.systemPromptOr(SYSTEM_PROMPT))
                .user(prompt)
                .call()
                .content();
        if (content == null || content.isBlank()) {
            throw new IllegalStateException("The chat model returned an empty blog draft");
        }
        return stripOuterCodeFence(content.trim());
    }

    private String stripOuterCodeFence(String content) {
        if (!content.startsWith("```") || !content.endsWith("```")) {
            return content;
        }
        int firstLineEnd = content.indexOf('\n');
        if (firstLineEnd < 0) {
            return content;
        }
        return content.substring(firstLineEnd + 1, content.length() - 3).trim();
    }
}
