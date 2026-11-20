import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmployeurService } from '../services/employeur.service'; // <-- AJOUT 1

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-travailleur',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTabsModule, 
    MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatIconModule
  ],
  templateUrl: './travailleur.html',
  styleUrls: ['./travailleur.css']
})
export class TravailleurComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private employeurService = inject(EmployeurService); // <-- AJOUT 2

  travailleurForm!: FormGroup;
  apiUrl = 'http://localhost:8083/api/travailleurs';

  ngOnInit(): void {
    this.travailleurForm = this.fb.group({
      // --- EN-TÊTE ---
      trvImmatriculation: [{ value: '', disabled: true }], 
      trvNom: ['', Validators.required],
      trvPrenom: [''],
      trvNomJeunefille: [''],
      trvNomPere: ['', Validators.required],
      trvNomMere: ['', Validators.required],
      trvPhoto: [''],
      trvDtDemande: ['', Validators.required],
      trvDtReception: ['', Validators.required],
      trvDtAssurance: ['', Validators.required],
      trvEtat: ['A', Validators.required],
      trvSexe: ['M', Validators.required],

      // --- AUTRES ---
      trvDtNaissance: [''],
      trvAnNaissance: [null, Validators.required],
      trvEtatCivil: ['', Validators.required],
      trvNationalite: [''],
      trvCni: [''],
      trvProvince: ['', Validators.required],
      trvCommune: ['', Validators.required],
      trvColline: ['', Validators.required],
      trvCatProf: [''],
      trvNiveauFormation: [''],
      trvRepLegal: [''],

      // --- ADRESSE ---
      trvRue: [''],
      trvLocalite: [''],
      trvVille: [''],
      trvPays: [''],
      trvCodePostal: [''],
      trvEmail: [''],
      trvFax: [''],
      trvTelephone: [''],
      // Adresse Postale
      trvRueP: [''],
      trvLocaliteP: [''],
      trvVilleP: [''],
      trvPaysP: [''],
      trvCodePostalP: [''],
      trvEmailP: [''],
      trvFaxP: [''],
      trvTelephoneP: [''],

      // --- ONGLET RELATION & SERVICES ---
      relations: this.fb.array([]),
      services: this.fb.array([]),

      // --- AUDIT ---
      trvDtCreee: [{ value: '', disabled: true }],
      trvUtilCree: [{ value: '', disabled: true }],
      trvDtModifiee: [{ value: '', disabled: true }],
      trvUtilModifie: [{ value: '', disabled: true }]
    });
    
    // Optionnel : ajouter une ligne de service vide par défaut
    // this.addService(); 
  }

  get relations(): FormArray { return this.travailleurForm.get('relations') as FormArray; }
  get services(): FormArray { return this.travailleurForm.get('services') as FormArray; }

  addRelation() {
    this.relations.push(this.fb.group({
      id: this.fb.group({
        relCode: ['', Validators.required],
        relTrvImmatriculation: [null]
      }),
      relNom: ['', Validators.required],
      relPrenom: [''],
      relDtNaissance: [''],
      relAnNaissance: [null, Validators.required],
      relSexe: ['M', Validators.required],
      relEtat: ['']
    }));
  }

  addService() {
    this.services.push(this.fb.group({
      id: this.fb.group({
        tserTrvImmatriculation: [null],
        tserDtEmbauche: ['', Validators.required],
        tserEmpSequence: [null, Validators.required] // Rempli automatiquement
      }),
      tserAffiliation: [null, Validators.required],
      tserDesignation: [''],
      tserTypeAss: ['', Validators.required],
      tserEtat: ['A', Validators.required],
      tserMatricule: ['', Validators.required], // <-- Ajout de Validators.required
      tserEmpNom: [''],
      tserSalaire: [null],
      tserDtFin: ['']
    }));
  }

  // =====================================================================
  // <-- AJOUT 3 : LA MÉTHODE POUR CHERCHER L'EMPLOYEUR
  // =====================================================================
  onMatriculeBlur(index: number): void {

    const group = this.services.at(index) as FormGroup;
    const rawValue = group.get('tserAffiliation')?.value;
   
    if (rawValue === null || rawValue === undefined || String(rawValue).trim() === '') {
      return;
    }

    const affiliation = Number(rawValue);
    if (!Number.isInteger(affiliation) || affiliation <= 0) {
      alert(`Numéro d'affiliation invalide. Veuillez saisir un nombre entier.`);
      group.get( 'tserEmpNom')?.reset();
      return;
    }

    this.employeurService.getByAffiliation(affiliation).subscribe({
      next: (employeur) => {
        // Remplissage automatique de l'ID employeur
        group.get(['id', 'tserEmpSequence'])?.patchValue(employeur.empSequence);
        group.get('tserEmpNom')?.patchValue(employeur.empNom);
        group.markAsDirty();
        
      },
      error: (err) => {
        if (err.status === 404) {
          group.get(['id', 'tserEmpSequence'])?.reset();
          group.get( 'tserEmpNom')?.reset();
          alert(`Aucun employeur trouvé avec l'affiliation : ${affiliation}`);
        } else {
          console.error('Erreur', err);
          alert('Erreur technique lors de la recherche.');
        }
      }
    });
  }
  // =====================================================================

  onSubmit() {
    if (this.travailleurForm.valid) {
      const data = this.travailleurForm.getRawValue();
      this.http.post(this.apiUrl, data).subscribe({
        next: (res: any) => {
          alert('Travailleur immatriculé avec succès ! N°: ' + res.trvImmatriculation);
          this.travailleurForm.reset();
        },
        error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
      });
    } else {
      alert('Veuillez vérifier les champs obligatoires.');
    }
  }
}