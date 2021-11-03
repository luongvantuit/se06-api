package appx.s.learn.se06.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WelcomeController {

    @GetMapping(value = {"/", "/welcome",})
    public String get() {
        return "welcome";
    }

}
