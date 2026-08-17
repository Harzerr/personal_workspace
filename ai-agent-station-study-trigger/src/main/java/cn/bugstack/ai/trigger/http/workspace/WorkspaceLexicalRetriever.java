package cn.bugstack.ai.trigger.http.workspace;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class WorkspaceLexicalRetriever {

    private static final double K1 = 1.2d;
    private static final double B = 0.75d;
    private static final Pattern TOKEN_PATTERN = Pattern.compile("[A-Za-z_][A-Za-z0-9_]*|[\\p{IsHan}]{1,2}|\\d+");

    public List<ScoredChunk> search(String query, Collection<WorkspaceChunk> chunks, int limit) {
        List<String> queryTerms = tokens(query);
        if (queryTerms.isEmpty() || chunks.isEmpty()) {
            return List.of();
        }

        Map<String, Integer> documentFrequency = new HashMap<>();
        Map<String, List<String>> documentTokens = new HashMap<>();
        double totalLength = 0;
        for (WorkspaceChunk chunk : chunks) {
            List<String> tokens = tokens(chunk.content());
            documentTokens.put(chunk.id(), tokens);
            totalLength += tokens.size();
            Set<String> unique = new HashSet<>(tokens);
            for (String term : queryTerms) {
                if (unique.contains(term)) {
                    documentFrequency.merge(term, 1, Integer::sum);
                }
            }
        }

        double averageLength = Math.max(1d, totalLength / chunks.size());
        List<ScoredChunk> results = new ArrayList<>();
        for (WorkspaceChunk chunk : chunks) {
            List<String> document = documentTokens.get(chunk.id());
            Map<String, Integer> termFrequency = new HashMap<>();
            document.forEach(term -> termFrequency.merge(term, 1, Integer::sum));
            double score = 0d;
            for (String term : queryTerms) {
                int frequency = termFrequency.getOrDefault(term, 0);
                if (frequency == 0) {
                    continue;
                }
                int df = documentFrequency.getOrDefault(term, 0);
                double idf = Math.log(1d + (chunks.size() - df + 0.5d) / (df + 0.5d));
                double denominator = frequency + K1 * (1d - B + B * document.size() / averageLength);
                score += idf * frequency * (K1 + 1d) / denominator;
            }
            if (score > 0d) {
                results.add(new ScoredChunk(chunk, score));
            }
        }
        results.sort((left, right) -> Double.compare(right.score(), left.score()));
        return results.stream().limit(limit).toList();
    }

    private List<String> tokens(String text) {
        List<String> tokens = new ArrayList<>();
        Matcher matcher = TOKEN_PATTERN.matcher(text == null ? "" : text.toLowerCase(Locale.ROOT));
        while (matcher.find()) {
            String token = matcher.group();
            if (token.length() > 1 || Character.UnicodeScript.of(token.charAt(0)) == Character.UnicodeScript.HAN) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    public record ScoredChunk(WorkspaceChunk chunk, double score) {
    }
}
