import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { DocumentComponent } from './document/document.component';
import { LibraryComponent } from './library/library.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { NavbarComponent } from './navbar/navbar.component';
import { GridListComponent } from './home/grid-list/grid-list.component';
import { OverallProgressBarComponent } from './navbar/overall-progress-bar/overall-progress-bar.component';
import { SmileyScoreComponent } from './navbar/total-score/smiley-score/smiley-score.component';
import { StarScoreComponent } from './navbar/total-score/star-score/star-score.component';
import { TotalScoreComponent } from './navbar/total-score/total-score.component';
import { DocDialogComponent } from './document/doc-dialog/doc-dialog.component';
import { FeaturedComponent } from './catalogue/featured/featured.component';
import { GenreComponent } from './catalogue/genre/genre.component';
import { StatsComponent } from './home/stats/stats.component';
import { DocCatalogListComponent } from './catalogue/doc-catalog-list/doc-catalog-list.component';
import { DocTextComponent } from './document/doc-text/doc-text.component';
import { DocBlankComponent } from './document/doc-blank/doc-blank.component';
import { DocKeyboardComponent } from './document/doc-keyboard/doc-keyboard.component';
import { DocMistakeCountComponent } from './document/doc-mistake-count/doc-mistake-count.component';
import { DocNlpPosComponent } from './document/versions/doc-nlp/doc-nlp-pos/doc-nlp-pos.component';
import { DocNlpCorefComponent } from './document/versions/doc-nlp/doc-nlp-coref/doc-nlp-coref.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { MaterialModule } from './material.module';
import { DocNlpPosDialogComponent } from './document/doc-nlp-dialog/doc-nlp-pos-dialog/doc-nlp-pos-dialog.component';
import { DocNlpCorefDialogComponent } from './document/doc-nlp-dialog/doc-nlp-coref-dialog/doc-nlp-coref-dialog.component';
import { CorrectMessageComponent } from './correct-message/correct-message.component';
import { IncorrectMessageComponent } from './incorrect-message/incorrect-message.component';
import { DocTextWikiComponent } from './document/versions/doc-text-wiki/doc-text-wiki.component';
import { DocImgComponent } from './document/versions/doc-img/doc-img.component';
import { DocPuzzleComponent } from './document/versions/doc-puzzle/doc-puzzle.component';
import { DocPuzzleImgComponent } from './document/versions/doc-puzzle-img/doc-puzzle-img.component';
import { ImageGeneratorComponent } from './document/versions/image-generator/image-generator.component';
import { DocTextImgGenComponent } from './document/versions/doc-text-img-gen/doc-text-img-gen.component';
import { AuthService } from './auth/auth.service';
import { PastDocumentsComponent } from './library/past-documents/past-documents.component';
import { DocumentsService } from './documents.service';
import { CurrentDocumentsComponent } from './library/current-documents/current-documents.component';
import { NewDocumentsComponent } from './catalogue/new-documents/new-documents.component';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { DocAiImgComponent } from './document/versions/doc-ai-img/doc-ai-img.component';
import { DocAiImgExp1Component } from './exp1/doc-ai-img-exp1/doc-ai-img-exp1.component';
import { DocNlpPosExp1Component } from './exp1/doc-nlp-pos-exp1/doc-nlp-pos-exp1.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { DocGiImgExp1Component } from './exp1/doc-gi-img-exp1/doc-gi-img-exp1.component';
import { DocGrImgExp1Component } from './exp1/doc-gr-img-exp1/doc-gr-img-exp1.component';
import { DocTextExp1Component } from './exp1/doc-text-exp1/doc-text-exp1.component';
import { DocNlpDialogExp1Component } from './exp1/doc-nlp-dialog-exp1/doc-nlp-dialog-exp1.component';
import { DocNliDialogComponent } from './document-nli/doc-nli-dialog/doc-nli-dialog.component';
import { DocNliImgComponent } from './document-nli/doc-nli-img/doc-nli-img.component';
import { DocNliTextComponent } from './document-nli/doc-nli-text/doc-nli-text.component';
import { DocNliAiImgComponent } from './document-nli/doc-nli-ai-img/doc-nli-ai-img.component';
import { DocNliTextExp1Component } from './exp1-nli/doc-nli-text-exp1/doc-nli-text-exp1.component';
import { DocNliAiExp1Component } from './exp1-nli/doc-nli-ai-exp1/doc-nli-ai-exp1.component';
import { DocNliGrExp1Component } from './exp1-nli/doc-nli-gr-exp1/doc-nli-gr-exp1.component';
import { DocNliGiExp1Component } from './exp1-nli/doc-nli-gi-exp1/doc-nli-gi-exp1.component';
import { DocEmojiPosDialogComponent } from './document/doc-nlp-dialog/doc-emoji-pos-dialog/doc-emoji-pos-dialog.component';
import { DocEmoPosExp2Component } from './exp2/doc-emo-pos-exp2/doc-emo-pos-exp2.component';
import { DocTextWdsExp2Component } from './exp2/doc-text-wds-exp2/doc-text-wds-exp2.component';
import { DocWdsDialogComponent } from './exp2/doc-wds-dialog/doc-wds-dialog.component';
import { DocEmoWdsDialogComponent } from './exp2/doc-emo-wds-dialog/doc-emo-wds-dialog.component';
import { DocPuzWdsDialogComponent } from './exp2/doc-puz-wds-dialog/doc-puz-wds-dialog.component';
import { DocEmoWdsExp2Component } from './exp2/doc-emo-wds-exp2/doc-emo-wds-exp2.component';
import { DocPuzWdsExp2Component } from './exp2/doc-puz-wds-exp2/doc-puz-wds-exp2.component';
import { DocNliTextExp3Component } from './exp3/doc-nli-text-exp3/doc-nli-text-exp3.component';
import { DocNliFlickrExp3Component } from './exp3/doc-nli-flickr-exp3/doc-nli-flickr-exp3.component';
import { DocNliDalle3Exp3Component } from './exp3/doc-nli-dalle3-exp3/doc-nli-dalle3-exp3.component';
import { DocNliDialogExp3Component } from './exp3/doc-nli-dialog-exp3/doc-nli-dialog-exp3.component';
// import { WordDisplayService } from './word-display.service';







// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DocumentComponent,
    LibraryComponent,
    CatalogueComponent,
    NavbarComponent,
    GridListComponent,
    OverallProgressBarComponent,
    SmileyScoreComponent,
    StarScoreComponent,
    TotalScoreComponent,
    DocDialogComponent,
    FeaturedComponent,
    GenreComponent,
    StatsComponent,
    DocCatalogListComponent,
    DocTextComponent,
    DocBlankComponent,
    DocKeyboardComponent,
    DocMistakeCountComponent,
    DocNlpPosComponent,
    DocNlpCorefComponent,
    SignupComponent,
    LoginComponent,
    DocNlpPosDialogComponent,
    DocNlpCorefDialogComponent,
    CorrectMessageComponent,
    IncorrectMessageComponent,
    DocImgComponent,
    DocPuzzleComponent,
    DocPuzzleImgComponent,
    ImageGeneratorComponent,
    DocTextWikiComponent,
    PastDocumentsComponent,
    CurrentDocumentsComponent,
    NewDocumentsComponent,
    DocAiImgComponent,
    DocAiImgExp1Component,
    DocNlpPosExp1Component,
    DocGiImgExp1Component,
    DocGrImgExp1Component,
    DocTextExp1Component,
    DocNlpDialogExp1Component,
    DocTextImgGenComponent,
    DocNliDialogComponent,
    DocNliImgComponent,
    DocNliTextComponent,
    DocNliAiImgComponent,
    DocNliTextExp1Component,
    DocNliAiExp1Component,
    DocNliGrExp1Component,
    DocNliGiExp1Component,
    DocEmojiPosDialogComponent,
    DocEmoPosExp2Component,
    DocTextWdsExp2Component,
    DocWdsDialogComponent,
    DocEmoWdsDialogComponent,
    DocPuzWdsDialogComponent,
    DocEmoWdsExp2Component,
    DocPuzWdsExp2Component,
    DocNliTextExp3Component,
    DocNliFlickrExp3Component,
    DocNliDalle3Exp3Component,
    DocNliDialogExp3Component,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp({ ...environment.firebase})),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
  providers: [AuthService, DocumentsService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
