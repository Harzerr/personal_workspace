package cn.bugstack.ai.config;

import com.zaxxer.hikari.HikariDataSource;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.util.Objects;

@Configuration
public class DataSourceConfig {

    @Bean("postgresDataSource")
    @Primary
    public DataSource postgresDataSource(@Value("${spring.datasource.postgresql.driver-class-name}") String driverClassName,
                                         @Value("${spring.datasource.postgresql.url}") String url,
                                         @Value("${spring.datasource.postgresql.username}") String username,
                                         @Value("${spring.datasource.postgresql.password}") String password,
                                         @Value("${spring.datasource.postgresql.hikari.maximum-pool-size:6}") int maximumPoolSize,
                                         @Value("${spring.datasource.postgresql.hikari.minimum-idle:1}") int minimumIdle,
                                         @Value("${spring.datasource.postgresql.hikari.idle-timeout:60000}") long idleTimeout,
                                         @Value("${spring.datasource.postgresql.hikari.connection-timeout:10000}") long connectionTimeout,
                                         @Value("${spring.datasource.postgresql.hikari.max-lifetime:1800000}") long maxLifetime) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMaximumPoolSize(maximumPoolSize);
        dataSource.setMinimumIdle(minimumIdle);
        dataSource.setIdleTimeout(idleTimeout);
        dataSource.setConnectionTimeout(connectionTimeout);
        dataSource.setMaxLifetime(maxLifetime);
        dataSource.setInitializationFailTimeout(1);
        dataSource.setConnectionTestQuery("SELECT 1");
        dataSource.setAutoCommit(true);
        dataSource.setPoolName("WorkspacePostgreSQL");
        return dataSource;
    }

    @Bean("sqlSessionFactory")
    public SqlSessionFactoryBean sqlSessionFactory(@Qualifier("postgresDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sqlSessionFactoryBean.setConfigLocation(resolver.getResource("classpath:/mybatis/config/mybatis-config.xml"));
        sqlSessionFactoryBean.setMapperLocations(resolver.getResources("classpath:/mybatis/mapper/*.xml"));
        return sqlSessionFactoryBean;
    }

    @Bean("sqlSessionTemplate")
    public SqlSessionTemplate sqlSessionTemplate(@Qualifier("sqlSessionFactory") SqlSessionFactoryBean sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(Objects.requireNonNull(sqlSessionFactory.getObject()));
    }

    @Bean("workspaceJdbcTemplate")
    public JdbcTemplate workspaceJdbcTemplate(@Qualifier("postgresDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean("pgVectorJdbcTemplate")
    @Primary
    public JdbcTemplate pgVectorJdbcTemplate(@Qualifier("postgresDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
