package be.howest.kevin.mindmap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

@SpringBootApplication
//@EnableAutoConfiguration
@EnableOAuth2Sso
public class MindmapApplication extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http

			.headers()
				.addHeaderWriter(new StaticHeadersWriter("Upgrade-Insecure-Requests","1")).and()
			.csrf()
			.disable()
				.antMatcher("/**")
					.authorizeRequests()
				.antMatchers("/assets/**","/sw.js","/manifest.json","/images/**")
					.permitAll()
				.anyRequest()
					.authenticated();
	}
	
	public static void main(String[] args) {
		SpringApplication.run(MindmapApplication.class, args);
	}
}
