package appx.s.learn.se06;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Se06Application {

    public static void main(String[] args) {
        SpringApplication.run(Se06Application.class, args);
    }

    @GetMapping(value = "/")
    @ResponseBody
    ResponseEntity<Object> get() {
        return new ResponseEntity<>("Welcome to API", HttpStatus.OK);
    }

}
