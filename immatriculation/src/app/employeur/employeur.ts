import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-employeur',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatStepperModule, 
    MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatCheckboxModule
  ],
  templateUrl: './employeur.html',
  styleUrls: ['./employeur.css']
})
export class EmployeurComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  employeurForm!: FormGroup;
  apiUrl = 'http://localhost:8083/api/employeurs';

  ngOnInit(): void {
    this.employeurForm = this.fb.group({
      // --- ÉTAPE 1: Employeur & Autres ---
      empNom: ['', Validators.required],
      empPrenom: [''],
      empAffiliation: [null],
      empAbrev: [''],
      empDtDemande: [''],
      empDtReception: ['', Validators.required],
      empAssurance: ['N', Validators.required],
      empEtat: ['A', Validators.required],
      empIndExempte: ['N', Validators.required],
      
      // Champs de l'image "Autres"
      empNatJuridique: ['', Validators.required],
      empAgence: [''],
      empProvince: ['', Validators.required],
      empCommune: ['', Validators.required],
      empColline: ['', Validators.required],
      empDtPremierEm: ['', Validators.required],
      empDtCreeEntr: ['', Validators.required],
      empDtNaissance: [''],
      empNbreTravaill: [1, Validators.required],
      empFrequencePaie: ['T'],
      empImpressionPr: [false],
      empAffilPrecedent: [null],
      empCompte: [''],

      // --- ÉTAPE 2: Adresse & Contact ---
      empRue: [''], empLocalite: ['', Validators.required], empVille: ['', Validators.required],
      empTelephone: ['', Validators.required], empEmail: [''],
      empContacte: [''], empQualiteC: [''], empTelephoneC: [''],

      // --- ÉTAPES 3, 4, 5 : Les TABLEAUX (FormArray) ---
      activites: this.fb.array([]),
      secteurs: this.fb.array([]),
      sousSecteurs: this.fb.array([]),
      situations: this.fb.array([]),
      documents: this.fb.array([])
    });
  }

  // Getters pour les tableaux
  get activites(): FormArray { return this.employeurForm.get('activites') as FormArray; }
  get secteurs(): FormArray { return this.employeurForm.get('secteurs') as FormArray; }
  get sousSecteurs(): FormArray { return this.employeurForm.get('sousSecteurs') as FormArray; }
  get situations(): FormArray { return this.employeurForm.get('situations') as FormArray; }
  get documents(): FormArray { return this.employeurForm.get('documents') as FormArray; }

  // --- Méthodes d'ajout de lignes ---
  addActivite() {
    this.activites.push(this.fb.group({
      eactActivite: ['', Validators.required],
      eactDtDebut: ['', Validators.required],
      eactDtFin: ['']
    }));
  }

  addSecteur() {
    this.secteurs.push(this.fb.group({
      esecSecteur: ['', Validators.required]
    }));
  }

  addSousSecteur() {
    this.sousSecteurs.push(this.fb.group({
      esseSousSecteur: ['', Validators.required]
    }));
  }

  addSituation() {
    this.situations.push(this.fb.group({
      esitOperation: ['', Validators.required],
      esitDtLettre: ['', Validators.required],
      esitDtEffet: ['', Validators.required],
      esitRaison: ['']
    }));
  }

  addDocument() {
    this.documents.push(this.fb.group({
      docDocument: ['', Validators.required],
      docReference: ['', Validators.required], // Nécessaire pour la clé composite
      docDtDepot: ['', Validators.required],
      docNbreCopies: [1, Validators.required],
      docCommentaires: ['']
    }));
  }

  onSubmit() {
    if (this.employeurForm.valid) {
      console.log("Données envoyées :", this.employeurForm.value);
      this.http.post(this.apiUrl, this.employeurForm.value).subscribe({
        next: (res: any) => alert('Tout a été enregistré avec succès ! ID: ' + res.empSequence),
        error: (err) => alert('Erreur : ' + err.message)
      });
    } else {
      alert('Veuillez remplir les champs obligatoires.');
    }
  }
}