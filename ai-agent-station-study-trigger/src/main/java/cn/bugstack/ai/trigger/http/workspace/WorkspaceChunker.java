package cn.bugstack.ai.trigger.http.workspace;

import com.github.javaparser.JavaParser;
import com.github.javaparser.ParseResult;
import com.github.javaparser.Range;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.BodyDeclaration;
import com.github.javaparser.ast.body.TypeDeclaration;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class WorkspaceChunker {

    private static final int MAX_CHUNK_CHARACTERS = 6_000;
    private static final Pattern MARKDOWN_HEADING = Pattern.compile("^(#{1,6})\\s+(.+?)\\s*$");

    public List<ChunkDraft> chunk(String sourcePath, String content) {
        String extension = extensionOf(sourcePath);
        if ("java".equals(extension)) {
            return chunkJava(content);
        }
        if ("md".equals(extension) || "markdown".equals(extension)) {
            return chunkMarkdown(content);
        }
        return chunkPlainText(content, "text");
    }

    private List<ChunkDraft> chunkJava(String source) {
        ParseResult<CompilationUnit> parsed = new JavaParser().parse(source);
        if (parsed.getResult().isEmpty()) {
            return chunkPlainText(source, "java-fallback");
        }

        List<String> lines = Arrays.asList(source.split("\\R", -1));
        List<ChunkDraft> chunks = new ArrayList<>();
        for (TypeDeclaration<?> type : parsed.getResult().orElseThrow().getTypes()) {
            List<BodyDeclaration<?>> members = type.getMembers();
            if (members.isEmpty()) {
                addRange(chunks, lines, type.getRange(), "java-type:" + type.getNameAsString());
                continue;
            }

            for (BodyDeclaration<?> member : members) {
                String label = "java-member:" + type.getNameAsString() + ":" + member.getClass().getSimpleName();
                addRange(chunks, lines, member.getRange(), label);
            }
        }

        return chunks.isEmpty() ? chunkPlainText(source, "java-fallback") : chunks;
    }

    private void addRange(List<ChunkDraft> chunks, List<String> lines, Optional<Range> range, String chunkType) {
        if (range.isEmpty()) {
            return;
        }
        int start = range.get().begin.line;
        int end = range.get().end.line;
        String text = String.join("\n", lines.subList(start - 1, Math.min(end, lines.size()))).trim();
        addChunkWithLimit(chunks, text, chunkType, start);
    }

    private List<ChunkDraft> chunkMarkdown(String source) {
        List<ChunkDraft> chunks = new ArrayList<>();
        String[] lines = source.split("\\R", -1);
        List<String> headingPath = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        int startLine = 1;
        String chunkType = "markdown:preamble";

        for (int index = 0; index < lines.length; index++) {
            Matcher matcher = MARKDOWN_HEADING.matcher(lines[index]);
            if (matcher.matches()) {
                addChunkWithLimit(chunks, current.toString(), chunkType, startLine);
                current.setLength(0);
                startLine = index + 1;

                int level = matcher.group(1).length();
                while (headingPath.size() >= level) {
                    headingPath.remove(headingPath.size() - 1);
                }
                headingPath.add(matcher.group(2).trim());
                chunkType = "markdown:" + String.join(" > ", headingPath);
            }
            current.append(lines[index]).append('\n');
        }
        addChunkWithLimit(chunks, current.toString(), chunkType, startLine);
        return chunks;
    }

    private List<ChunkDraft> chunkPlainText(String source, String chunkType) {
        List<ChunkDraft> chunks = new ArrayList<>();
        addChunkWithLimit(chunks, source, chunkType, 1);
        return chunks;
    }

    private void addChunkWithLimit(List<ChunkDraft> chunks, String text, String chunkType, int startLine) {
        String normalized = text == null ? "" : text.trim();
        if (normalized.isEmpty()) {
            return;
        }

        String[] lines = normalized.split("\\R", -1);
        StringBuilder current = new StringBuilder();
        int currentStart = startLine;
        int currentLine = startLine;
        for (String line : lines) {
            if (current.length() > 0 && current.length() + line.length() + 1 > MAX_CHUNK_CHARACTERS) {
                chunks.add(new ChunkDraft(chunkType, currentStart, currentLine - 1, current.toString().trim()));
                current.setLength(0);
                currentStart = currentLine;
            }
            current.append(line).append('\n');
            currentLine++;
        }
        if (!current.isEmpty()) {
            chunks.add(new ChunkDraft(chunkType, currentStart, currentLine - 1, current.toString().trim()));
        }
    }

    private String extensionOf(String sourcePath) {
        int dot = sourcePath.lastIndexOf('.');
        return dot < 0 ? "" : sourcePath.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    public record ChunkDraft(String chunkType, int startLine, int endLine, String content) {
    }
}
