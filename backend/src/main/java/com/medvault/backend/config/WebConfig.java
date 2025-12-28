package com.medvault.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Serve ALL uploads (doctors + records)
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///C:/medvault/uploads/")
                .setCachePeriod(0);
    }
}
