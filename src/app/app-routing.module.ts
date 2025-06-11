import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DocumentComponent } from './document/document.component';

import { DocImgComponent } from './document/versions/doc-img/doc-img.component';
import { DocPuzzleComponent } from './document/versions/doc-puzzle/doc-puzzle.component';
import { DocPuzzleImgComponent } from './document/versions/doc-puzzle-img/doc-puzzle-img.component';
import { ImageGeneratorComponent } from './document/versions/image-generator/image-generator.component';
import { DocTextImgGenComponent } from './document/versions/doc-text-img-gen/doc-text-img-gen.component';
import { DocNlpPosComponent } from './document/versions/doc-nlp/doc-nlp-pos/doc-nlp-pos.component';
import { DocNlpCorefComponent } from './document/versions/doc-nlp/doc-nlp-coref/doc-nlp-coref.component';
import { DocAiImgComponent } from './document/versions/doc-ai-img/doc-ai-img.component';
import { DocAiImgExp1Component } from './exp1/doc-ai-img-exp1/doc-ai-img-exp1.component';
import { DocGiImgExp1Component } from './exp1/doc-gi-img-exp1/doc-gi-img-exp1.component';
import { DocGrImgExp1Component } from './exp1/doc-gr-img-exp1/doc-gr-img-exp1.component';
import { DocTextExp1Component } from './exp1/doc-text-exp1/doc-text-exp1.component';


import { LibraryComponent } from './library/library.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { FeaturedComponent } from './catalogue/featured/featured.component';
import { GenreComponent } from './catalogue/genre/genre.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
// import { DocNliDialogComponent } from './document-nli/doc-nli-dialog/doc-nli-dialog.component';
import { DocNliImgComponent } from './document-nli/doc-nli-img/doc-nli-img.component';
import { DocNliTextComponent } from './document-nli/doc-nli-text/doc-nli-text.component';
import { DocNliTextExp1Component } from './exp1-nli/doc-nli-text-exp1/doc-nli-text-exp1.component';
import { DocNliAiImgComponent } from './document-nli/doc-nli-ai-img/doc-nli-ai-img.component';
import { DocNliAiExp1Component } from './exp1-nli/doc-nli-ai-exp1/doc-nli-ai-exp1.component';
import { DocNliGrExp1Component } from './exp1-nli/doc-nli-gr-exp1/doc-nli-gr-exp1.component';
import { DocNliGiExp1Component } from './exp1-nli/doc-nli-gi-exp1/doc-nli-gi-exp1.component';
import { DocEmoPosExp2Component } from './exp2/doc-emo-pos-exp2/doc-emo-pos-exp2.component';
import { DocTextWdsExp2Component } from './exp2/doc-text-wds-exp2/doc-text-wds-exp2.component';
import { DocEmoWdsExp2Component } from './exp2/doc-emo-wds-exp2/doc-emo-wds-exp2.component';
import { DocPuzWdsExp2Component } from './exp2/doc-puz-wds-exp2/doc-puz-wds-exp2.component';
import { DocNliTextExp3Component } from './exp3/doc-nli-text-exp3/doc-nli-text-exp3.component';
import { DocNliFlickrExp3Component } from './exp3/doc-nli-flickr-exp3/doc-nli-flickr-exp3.component';
import { DocNliDalle3Exp3Component } from './exp3/doc-nli-dalle3-exp3/doc-nli-dalle3-exp3.component';




const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'document', component: DocumentComponent },
  // { path: 'doc-img/:id', component: DocImgComponent },
  // { path: 'doc-nlp-pos/:id', component: DocNlpPosComponent },
  // { path: 'doc-nlp-coref/:id', component: DocNlpCorefComponent },
  { path: 'doc-puz-wds-exp2/:id', component: DocPuzWdsExp2Component },
  { path: 'doc-puz-wds/:id', component: DocPuzzleComponent },
  { path: 'doc-emo-wds-exp2/:id', component: DocEmoWdsExp2Component },
  { path: 'doc-text-wds-exp2/:id', component: DocTextWdsExp2Component },
  // { path: 'library', component: LibraryComponent },
  // { path: 'catalogue', component: CatalogueComponent },
  // { path: 'featured', component: FeaturedComponent },
  // { path: 'genre', component: GenreComponent },
  // { path: 'signup', component: SignupComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'img-gen/:id', component: ImageGeneratorComponent },
  // { path: 'doc-text-img-gen/:id', component: DocTextImgGenComponent },
  // { path: 'ai-img-new/:id', component: DocAiImgComponent },
  { path: 'ai-img-exp1/:id', component: DocAiImgExp1Component },
  { path: 'gr-img-exp1/:id', component: DocGrImgExp1Component },
  { path: 'gi-img-exp1/:id', component: DocGiImgExp1Component },
  { path: 'text-exp1/:id', component: DocTextExp1Component },
  { path: 'nli-img/:id', component: DocNliImgComponent },
  { path: 'nli-ai-img/:id', component: DocNliAiImgComponent },
  { path: 'nli-text/:id', component: DocNliTextComponent },
  { path: 'nli-text-exp1/:id', component: DocNliTextExp1Component },
  { path: 'nli-ai-exp1/:id', component: DocNliAiExp1Component },
  { path: 'nli-gr-exp1/:id', component: DocNliGrExp1Component },
  { path: 'nli-gi-exp1/:id', component: DocNliGiExp1Component },
  { path: 'nli-text-exp3/:id', component: DocNliTextExp3Component },
  { path: 'nli-flickr-exp3/:id', component: DocNliFlickrExp3Component },
  { path: 'nli-dalle3-exp3/:id', component: DocNliDalle3Exp3Component }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
