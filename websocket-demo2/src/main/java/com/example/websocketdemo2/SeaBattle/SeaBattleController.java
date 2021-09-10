package com.example.websocketdemo2.SeaBattle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(originPatterns = "**")
@RequestMapping("/api/seabattle")
public class SeaBattleController {

    private SeaBattleService seaBattleService;

    @Autowired
    public SeaBattleController(SeaBattleService seaBattleService) {
        this.seaBattleService = seaBattleService;
    }

    @GetMapping
    public List<SeaBattleGameDto> getGames(){
        return seaBattleService.getCreatedGames();
    }
}
