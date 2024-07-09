package com.icehufs.icebreaker.controller;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icehufs.icebreaker.dto.request.article.PatchCommentRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostArticleRequestDto;
import com.icehufs.icebreaker.dto.request.article.PostCommentRequestDto;
import com.icehufs.icebreaker.dto.request.auth.GiveUserBanRequestDto;
import com.icehufs.icebreaker.dto.response.article.DeleteArticleAdminResponseDto;
import com.icehufs.icebreaker.dto.response.article.DeleteCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PatchCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostArticleResponseDto;
import com.icehufs.icebreaker.dto.response.article.PostCommentResponseDto;
import com.icehufs.icebreaker.dto.response.article.PutResolvedArticleResponseDto;
import com.icehufs.icebreaker.dto.response.auth.GiveUserBanResponseDto;
import com.icehufs.icebreaker.service.ArticleService;
import com.icehufs.icebreaker.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin1")
public class ArticleAdminController {

    private final ArticleService articleService;
    private final AuthService authService;

    @PostMapping("/{articleNum}/comment")
    public ResponseEntity<? super PostCommentResponseDto> postComment(
        @RequestBody @Valid PostCommentRequestDto requestBody,
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PostCommentResponseDto> response = articleService.postComment(requestBody, articleNum, email);
        return response;
    }

    @PatchMapping("/comment/{commentNumber}")
    public ResponseEntity<? super PatchCommentResponseDto> patchComment(
        @RequestBody @Valid PatchCommentRequestDto requestBody,
        @PathVariable Integer commentNumber,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PatchCommentResponseDto> response = articleService.patchComment(requestBody, commentNumber, email);
        return response;
    }

    @DeleteMapping("/comment/{commentNumber}")
    public ResponseEntity<? super DeleteCommentResponseDto> deleteComment(
        @PathVariable Integer commentNumber,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super DeleteCommentResponseDto> response = articleService.deleteComment(commentNumber, email);
        return response;
    }

    @DeleteMapping("/{articleNum}")
    public ResponseEntity<? super DeleteArticleAdminResponseDto> deleteArticleAdmin(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super DeleteArticleAdminResponseDto> response = articleService.deleteArticleAdmin(articleNum, email);
        return response;
    }

    @PutMapping("/{articleNum}/resolv")
    public ResponseEntity<? super PutResolvedArticleResponseDto> putresolv(
        @PathVariable Integer articleNum,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PutResolvedArticleResponseDto> response = articleService.putResolv(articleNum, email);
        return response;
    }
    
    @PostMapping("/give-ban/{articleNum}")
    public ResponseEntity<? super GiveUserBanResponseDto> GiveUserBan (
            @PathVariable Integer articleNum,
            @RequestBody @Valid GiveUserBanRequestDto requestBody
    ) {
        ResponseEntity<? super GiveUserBanResponseDto> response = authService.giveUserBan(requestBody, articleNum);
        return response;
    }

    @PostMapping("/article")
    public ResponseEntity<? super PostArticleResponseDto> postArticleNotif(
        @RequestBody @Valid PostArticleRequestDto requestBody,
        @AuthenticationPrincipal String email
    ){
        ResponseEntity<? super PostArticleResponseDto> response = articleService.postArticleNotif(requestBody, email);
        return response;
    }

}