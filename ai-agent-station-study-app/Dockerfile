FROM eclipse-temurin:17-jre-alpine

LABEL org.opencontainers.image.title="personal_workspace"

ENV PARAMS=""
ENV TZ=Asia/Shanghai
ENV WORKSPACE_SERVER_ADDRESS=0.0.0.0
ENV WORKSPACE_BLOG_STORAGE_DIR=/app/data/blog
ENV JAVA_OPTS="-XX:+UseSerialGC -XX:InitialRAMPercentage=20 -XX:MaxRAMPercentage=65 -XX:MaxMetaspaceSize=192m -XX:+ExitOnOutOfMemoryError"

WORKDIR /app

RUN addgroup -S workspace && \
    adduser -S workspace -G workspace && \
    mkdir -p /app/data/blog && \
    chown -R workspace:workspace /app

COPY --chown=workspace:workspace target/ai-agent-station-study-app.jar /app/app.jar

USER workspace
VOLUME ["/app/data"]
EXPOSE 8099

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar $PARAMS"]
