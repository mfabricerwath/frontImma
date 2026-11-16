import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './employeur.html',
  styleUrls: ['./employeur.css']
})
export class EmployeurComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @ViewChild('stepper') stepper!: MatStepper;

  employeurForm!: FormGroup;
  apiUrl = 'http://localhost:8083/api/employeurs';

   // Déclaration des sous-groupes
  etape1Form!: FormGroup;
  etape2Form!: FormGroup;
  etape3Form!: FormGroup;
  etape4Form!: FormGroup;
  etape5Form!: FormGroup;

  ngOnInit(): void {
    // --- SOUS-GROUPE 1 : Employeur & Autres ---
    this.etape1Form = this.fb.group({
      empNom: ['', Validators.required],
      empPrenom: [''],
      empAffiliation: [null],
      empAbrev: ['',Validators.required],
      empDtDemande: [''],
      empDtReception: ['', Validators.required],
      empAssurance: ['N', Validators.required],
      empEtat: ['A', Validators.required],
      empIndExempte: ['N', Validators.required],
      
      empNatJuridique: ['', Validators.required],
      empAgence: [''],
      empProvince: ['', Validators.required],
      empCommune: ['', Validators.required],
      empColline: ['', Validators.required],
      empDtPremierEm: ['', Validators.required],
      empDtCreeEntr: ['', Validators.required],
      empDtNaissance: [''],
      empNbreTravaill: [1, Validators.required],
      empCodeFiscal: ['', Validators.required],
      empRegCommerce:['',Validators.required],
      empFrequencePaie: ['T'],
      empImpressionPr: [false],
      empAffilPrecedent: [null],
      empCompte: ['']
    });

    // --- SOUS-GROUPE 2 : Adresse & Contact ---
    this.etape2Form = this.fb.group({
      empRue: [''], 
      empLocalite: ['', Validators.required], 
      empVille: ['', Validators.required],
      empTelephone: ['', Validators.required], 
      empEmail: [''],
      empContacte: [''], 
      empQualiteC: [''], 
      empTelephoneC: ['']
    });

    // --- SOUS-GROUPE 3 : Secteurs (Tableau) ---
    this.etape3Form = this.fb.group({
      secteurs: this.fb.array([])
    });

    // --- SOUS-GROUPE 4 : Activités (Tableau) ---
    this.etape4Form = this.fb.group({
      activites: this.fb.array([])
    });

    // --- SOUS-GROUPE 5 : Situations (Tableau) ---
    this.etape5Form = this.fb.group({
      situations: this.fb.array([])
    });
  }

  // Getters pour les tableaux (attention, ils pointent maintenant vers leurs sous-groupes)
  get secteurs(): FormArray { return this.etape3Form.get('secteurs') as FormArray; }
  get activites(): FormArray { return this.etape4Form.get('activites') as FormArray; }
  get situations(): FormArray { return this.etape5Form.get('situations') as FormArray; }

 

  // --- Méthodes d'ajout de lignes ---
  addSecteur() {
    this.secteurs.push(this.fb.group({
      esecSecteur: ['', Validators.required]
    }));
  }

  addActivite() {
    this.activites.push(this.fb.group({
      eactActivite: ['', Validators.required],
      eactDtDebut: ['', Validators.required],
      eactDtFin: ['']
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

  // --- Soumission ---
     onSubmit() {
    // 1. On vérifie si TOUS les sous-groupes sont valides
    if (this.etape1Form.valid && this.etape2Form.valid && this.etape3Form.valid && this.etape4Form.valid && this.etape5Form.valid) {
      
      // 2. On fusionne toutes les données dans un seul objet JSON
      const donneesFinales = {
        ...this.etape1Form.value,
        ...this.etape2Form.value,
        ...this.etape3Form.value,
        ...this.etape4Form.value,
        ...this.etape5Form.value
      };

      // 3. Envoi au backend
      this.http.post(this.apiUrl, donneesFinales).subscribe({
        next: (res: any) => {
          // 4. Affichage de l'affiliation renvoyée par le serveur
          alert('Succès ! Numéro d\'affiliation généré : ' + res.empAffiliation);
          
          // 5. Réinitialisation du formulaire et du stepper
          this.stepper.reset();
          this.etape1Form.reset();
          this.etape2Form.reset();
          this.etape3Form.reset();
          this.etape4Form.reset();
          this.etape5Form.reset();
        },
        error: (err) => {
          // En cas d'erreur, on affiche le message renvoyé par le serveur
          const message = err.error?.message || err.message || 'Une erreur est survenue';
          alert('Erreur lors de la sauvegarde : ' + message);
        }
      });
    } else {
      // Si un formulaire est invalide, on prévient l'utilisateur
      alert('Veuillez vérifier toutes les étapes. Certains champs obligatoires ne sont pas remplis.');
    }
  }
}