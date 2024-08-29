import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import readXlsxFile from 'read-excel-file';
import * as XLSX from 'xlsx';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';

import { HotToastService } from '@ngneat/hot-toast';
import { NotificacaoService } from '../../services/toast.service';

@Component({
  selector: 'app-comparador-excel',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbProgressbar],
  templateUrl: './comparador-excel.component.html',
  styleUrl: './comparador-excel.component.scss',
  providers: [
    NotificacaoService
  ]
})

export class ComparadorExcelComponent {

  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  loading = false

  arquivo1: any = [];
  arquivo2: any = [];

  arquivosForm: FormGroup;

  porcentagem: number = 0;

  colunaCompararNome: FormControl
  colunaParametro: FormControl

  constructor(
    private notificacaoService: NotificacaoService,
    private fb: FormBuilder) {

    this.arquivosForm = fb.group({
      arquivo1: fb.control(null, Validators.required),
      arquivo2: fb.control(null, Validators.required),
    })

    this.colunaCompararNome = new FormControl(null);
    this.colunaParametro = new FormControl(null);
  }

  changeFile(event: any, numArquivo: number) {
    var file: File = event.target.files[0];

    const nameType = file.name.split('.')
    const type = nameType[nameType.length - 1]

    if (type !== 'xlsx' && type !== 'xls') {

      if (numArquivo === 1)
        this.arquivosForm.get('arquivo1')?.setValue('')
      else
        this.arquivosForm.get('arquivo2')?.setValue('')

      this.notificacaoService.notificacaoAlerta('O arquivo deve ser .xlsx ou .xls');
      return;
    }

    readXlsxFile(file).then((rows) => {
      if (numArquivo === 1)
        this.arquivo1 = rows;
      else
        this.arquivo2 = rows;
    })
  }

  exportToExcel(json: any[]) {
    const columns = this.getColumns(json);
    const worksheet = XLSX.utils.json_to_sheet(json, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');

    this.notificacaoService.notificacaoSucesso('Excel exportado com sucesso!');
  }

  getColumns(data: any[]): string[] {
    const columns: any[] = [];
    data.forEach(row => {
      Object.keys(row).forEach(col => {
        if (!columns.includes(col)) {
          columns.push(col);
        }
      });
    });
    return columns;
  }

  gerarExcel() {
    this.linhasFaltando();
    //this.exportToExcel(this.arquivo1);
  }

  linhasFaltando() {
    let listaNova: any[] = []

    this.porcentagem = 0;
    let contagem: number = 0;

    let colunaComparar: number = 0

    if (this.colunaCompararNome.value)
      colunaComparar = this.arquivo1[0].findIndex((item: any) => item.toLowerCase() === this.colunaCompararNome.value.toLowerCase());

    if (colunaComparar === -1) {
      this.notificacaoService.notificacaoErro('Coluna não existe no arquivo!');
      return;
    }

    this.arquivo1.forEach((item1: any) => {

      if (!this.arquivo2.some((item2: any) => item2[colunaComparar] === item1[colunaComparar])) {
        listaNova.push(item1);
      }

      setTimeout(() => {
        contagem++;
        this.porcentagem = Number((contagem / this.arquivo1.length * 100).toFixed(1));
        console.log(this.porcentagem + '%');
      }, 1);
    });
    this.exportToExcel(listaNova);
  }

  comparaListaParametro() {
    this.compararParametros(this.arquivo1, this.arquivo2);
  }

  compararParametros(lista: any[], parametrosBase: any[]) {

    let colunaComparar: number = this.arquivo1[0].length - 1

    if (this.colunaParametro.value)
      colunaComparar = this.arquivo1[0].findIndex((item: any) => item.toLowerCase() === this.colunaParametro.value.toLowerCase());

    if (colunaComparar === -1) {
      this.notificacaoService.notificacaoErro('Coluna não existe no arquivo!');
      return;
    }

    this.porcentagem = 0;
    let contagem: number = 0;

    let listaNova: any[] = [];
    //Add cabeçalho
    listaNova.push(this.arquivo1[0]);

    parametrosBase.splice(0, 1);
    lista.splice(0, 1);

    lista.forEach((linha: any) => {

      let parametros: any[] = [];

      Object.keys(linha).forEach((_: any, index: number) => {

        //pular coluna a ser comparada no final
        if (colunaComparar === index)
          return;

        if (!parametros.length)
          parametros = parametrosBase.filter((parametro: any) => {
            console.log(parametro, index);
            if (!parametro[index])
              return true;
            else
              return parametro[index] === linha[index]
          })
        else
          parametros = parametros.filter((parametro: any) => {
            if (!parametro[index])
              return true;
            else
              return parametro[index] === linha[index]
          })

      })

      if (parametros[0]) {
        const valorPadrao = linha[colunaComparar];
        const valorCerto = parametros[0][colunaComparar];

        if (valorPadrao !== valorCerto)
          listaNova.push(linha);
      }

      setTimeout(() => {
        contagem++;
        this.porcentagem = Number((contagem / lista.length * 100).toFixed(1));
        console.log(this.porcentagem + '%');
      }, 1);
    })

    this.loading = false;
    this.exportToExcel(listaNova);
  }
}
