import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employeur',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatStepperModule, MatInputModule, 
    MatSelectModule, MatButtonModule, MatFormFieldModule, MatIconModule
  ],
  templateUrl: './employeur.html',
  styleUrls: ['./employeur.css']
})
export class EmployeurComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @ViewChild('stepper') stepper!: MatStepper;

  etape1Employeur!: FormGroup;
  etape2Adresse!: FormGroup;
  etape3Contact!: FormGroup;
  etape4Autres!: FormGroup;

  apiUrl = 'http://localhost:8083/api/employeurs';

  ngOnInit(): void {
    this.etape1Employeur = this.fb.group({
      empNom: ['', Validators.required], // Obligatoire
      empPrenom: [''],
      empAffiliation: [null],
      empAbrev: [''],
      empDtDemande: [''], // Pas obligatoire dans l'entité (pas de nullable=false)
      empDtReception: ['', Validators.required], // Obligatoire
      empAssurance: ['N', Validators.required], // Obligatoire
      empEtat: ['A', Validators.required], // Obligatoire
      empIndExempte: ['N', Validators.required] // Ajouté ici pour être sûr de l'avoir
    });

    this.etape2Adresse = this.fb.group({
      empRue: [''],
      empLocalite: ['', Validators.required], // Obligatoire
      empVille: ['', Validators.required], // Obligatoire
      empTelephone: ['', Validators.required], // Obligatoire
      empEmail: [''],
      empProvince: ['', Validators.required], // Obligatoire
      empCommune: ['', Validators.required], // Obligatoire
      empColline: ['', Validators.required] // Obligatoire
    });

    this.etape3Contact = this.fb.group({
      empContacte: [''],
      empQualiteC: [''],
      empTelephoneC: ['']
    });

    this.etape4Autres = this.fb.group({
      empDtCreeEntr: ['', Validators.required], // Obligatoire
      empDtPremierEm: ['', Validators.required], // Obligatoire
      empNbreTravaill: [1, Validators.required], // Obligatoire
      empCodeFiscal: ['', Validators.required], // Obligatoire
      empRegCommerce: ['', Validators.required] // Obligatoire
    });
  }

  onSubmit() {
    if (this.etape1Employeur.valid && this.etape2Adresse.valid && 
        this.etape3Contact.valid && this.etape4Autres.valid) {
      
      const finalData = {
        ...this.etape1Employeur.value,
        ...this.etape2Adresse.value,
        ...this.etape3Contact.value,
        ...this.etape4Autres.value
      };

      this.http.post(this.apiUrl, finalData).subscribe({
        next: (res: any) => {
          alert('Succès ! Employeur créé avec l\'ID: ' + res.empSequence);
          this.stepper.reset();
        },
        error: (err) => alert('Erreur lors de la sauvegarde : ' + err.message)
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires (marqués d\'un astérisque *).');
    }
  }
}