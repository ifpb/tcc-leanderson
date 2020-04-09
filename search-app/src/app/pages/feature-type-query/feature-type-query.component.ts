import { HttpErrorResponse } from '@angular/common/http';
import { QueryService } from './../../services/query.service';
import { FeatureType, CHOICE_LEVEL } from './../../model/service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feature-type-query',
  templateUrl: './feature-type-query.component.html',
  styleUrls: ['./feature-type-query.component.scss']
})
export class FeatureTypeQueryComponent implements OnInit {

  features: FeatureType[];
  placeName: string;
  blocked_button: boolean = false;
  error: string;
  choices: any[];

  // pagination
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private queryService: QueryService
  ) { }

  ngOnInit() {
    this.features = null;
    this.error = '';
  }

  search() {
    this.initSearch();
    this.queryService.findeFeaturesTypes(this.placeName).then((features: FeatureType[]) => {
      this.features = features;
      this.afterRequest(features);
    }).catch((err: HttpErrorResponse) => {
      console.log('falha no req', err);
      switch (err.status) {
        case 204:
          this.error = `Nenhum recurso foi encontrado vinculado ao local: ${this.placeName}!`;
          break;
        case 300:
          this.choices = err.error;
          this.error = `Mais de um recuso para ${this.placeName} foi encontrado, escolha um local listado abaixo.`;
          break;
        case 404:
          this.error = `Nenhuma localidade foi encontrada com a pesquisa: ${this.placeName}!`;
          break;
      }
    }).finally(() => {
      this.blocked_button = false;
    });
  }

  initSearch(){
    if(this.features && this.features.length > 0)
      this.features = null;
    console.log(this.placeName);
    this.blocked_button = true;
    this.error = '';
    this.choices = null;
  }

  afterRequest(features){
    console.log(features);
    this.features.sort((a, b) => {return b.similarity - a.similarity});
  }

  selectChoice(item: any){
    this.initSearch();
    this.queryService.choicePlace(item, CHOICE_LEVEL.FEATURE_TYPE).then((features: FeatureType[]) => {
      this.features = features;
      this.afterRequest(features);
    }).catch(err => console.log(err))
    .finally(() => {
      this.blocked_button = false;
    });
  }

}
