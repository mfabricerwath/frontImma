import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

// Service Employeur
import { EmployeurService } from '../services/employeur.service';

@Component({
  selector: 'app-travailleur',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTabsModule, 
    MatInputModule, MatSelectModule, MatButtonModule, 
    MatFormFieldModule, MatIconModule, MatRadioModule
  ],
  templateUrl: './travailleur.html',
  styleUrls: ['./travailleur.css']
})
export class TravailleurComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private employeurService = inject(EmployeurService);
  
  // ⚠️ N'oubliez pas de mettre l'IP réseau si vous testez depuis un autre appareil
  apiUrl = 'http://172.16.0.205:8083/api/travailleurs'; 

  // ==========================================
  // SIGNAUX
  // ==========================================
  modeAction = signal<'CREATE' | 'UPDATE' | 'DELETE'>('CREATE');
  isLoading = signal<boolean>(false);
  travailleurCharge = signal<any | null>(null);
  
  // Signal pour stocker les employeurs trouvés (clé = index de la ligne)
  employeursTrouves = signal<{ [key: number]: any }>({});

  buttonLabel = computed(() => {
    switch (this.modeAction()) {
      case 'CREATE': return 'Enregistrer';
      case 'UPDATE': return 'Mettre à jour';
      case 'DELETE': return 'Supprimer définitivement';
    }
  });
  buttonColor = computed(() => this.modeAction() === 'DELETE' ? 'warn' : 'primary');

  // ==========================================
  // FORMULAIRE
  // ==========================================
  travailleurForm!: FormGroup;

  ngOnInit(): void {
    this.travailleurForm = this.fb.group({
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

      trvDtNaissance: [''],
      trvAnNaissance: [null, Validators.required],
      trvLieuNaissance: [''],
      trvEtatCivil: ['', Validators.required],
      trvNationalite: [''],
      trvCni: [''],
      trvProvince: ['', Validators.required],
      trvCommune: ['', Validators.required],
      trvColline: ['', Validators.required],
      trvCatProf: [''],
      trvNiveauFormation: [''],
      trvRepLegal: [''],
      trvLivret: [''],
      trvSalaire: [null],

      trvRue: [''], trvLocalite: [''], trvVille: [''], trvPays: [''], trvCodePostal: [''], trvEmail: [''], trvFax: [''], trvTelephone: [''],
      trvRueP: [''], trvLocaliteP: [''], trvVilleP: [''], trvPaysP: [''], trvCodePostalP: [''], trvEmailP: [''], trvFaxP: [''], trvTelephoneP: [''],

      relations: this.fb.array([]),
      services: this.fb.array([]),

      // Audit (Non modifiable)
      trvDtCreee: [{ value: '', disabled: true }],
      trvUtilCree: [{ value: '', disabled: true }],
      trvDtModifiee: [{ value: '', disabled: true }],
      trvUtilModifie: [{ value: '', disabled: true }]
    });
  }

  get relations(): FormArray { return this.travailleurForm.get('relations') as FormArray; }
  get services(): FormArray { return this.travailleurForm.get('services') as FormArray; }

  // ==========================================
  // TABLEAUX DYNAMIQUES
  // ==========================================
  addRelation() {
    // Génère un code unique basé sur la date (ex: REL-1716380000000)
    const codeTemporaire = 'REL-' + new Date().getTime(); 

    this.relations.push(this.fb.group({
      id: this.fb.group({
        relCode: [codeTemporaire, Validators.required], // <-- Code généré
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
        tserEmpSequence: [null, Validators.required]
      }),
      tserAffiliation: [null, Validators.required],
      tserDesignation: [''],
      tserTypeAss: ['', Validators.required],
      tserEtat: ['A', Validators.required],
      tserMatricule: ['', Validators.required],
      tserEmpNom: [''],
      tserSalaire: [null],
      tserDtFin: ['']
    }));
  }

  // Supprime la ligne de service et nettoie le signal
  removeService(index: number) {
    this.services.removeAt(index);
    
    // On retire l'employeur du signal pour cet index
    this.employeursTrouves.update(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  }

  // ==========================================
  // RECHERCHE EMPLOYEUR (Pour les services)
  // ==========================================
  onMatriculeBlur(index: number): void {
    const group = this.services.at(index) as FormGroup;
    const rawValue = group.get('tserAffiliation')?.value;

    if (!rawValue || String(rawValue).trim() === '') return;

    const affiliation = Number(rawValue);
    
    this.employeurService.getByAffiliation(affiliation).subscribe({
      next: (employeur) => {
        // 1. Remplissage du formulaire
        group.get(['id', 'tserEmpSequence'])?.patchValue(employeur.empSequence);
        group.get('tserEmpNom')?.patchValue(employeur.empNom || employeur.empAbrev);
        group.markAsDirty();

        // 2. Mise à jour du signal
        this.employeursTrouves.update(prev => ({
          ...prev,
          [index]: employeur
        }));
      },
      error: (err) => {
        if (err.status === 404) {
          group.get(['id', 'tserEmpSequence'])?.reset();
          group.get('tserEmpNom')?.reset();
          
          // On retire du signal
          this.employeursTrouves.update(prev => {
            const copy = { ...prev };
            delete copy[index];
            return copy;
          });

          alert(`Aucun employeur trouvé avec l'affiliation : ${affiliation}`);
        }
      }
    });
  }

  // ==========================================
  // GESTION DES MODES
  // ==========================================
  setMode(mode: 'CREATE' | 'UPDATE' | 'DELETE') {
    this.modeAction.set(mode);
    this.resetForm(); // On vide le formulaire

    const immatControl = this.travailleurForm.get('trvImmatriculation');
    if (mode === 'CREATE') {
      immatControl?.disable(); // Désactivé pour la création
    } else {
      immatControl?.enable();  // Activé pour recherche/modif/suppr
    }
  }

  // ==========================================
  // RECHERCHE D'UN TRAVAILLEUR
  // ==========================================
  rechercherTravailleur() {
    const immat = this.travailleurForm.get('trvImmatriculation')?.value;
    if (!immat) return;

    this.isLoading.set(true);
    
    this.http.get<any>(`${this.apiUrl}/${immat}`).subscribe({
      next: (data) => {
        this.travailleurCharge.set(data);
        this.travailleurForm.patchValue(data);

        // Remplissage des relations
        this.relations.clear();
        if (data.relations) {
          data.relations.forEach((rel: any) => {
            this.relations.push(this.fb.group({
              id: this.fb.group({ relCode: [rel.id?.relCode], relTrvImmatriculation: [rel.id?.relTrvImmatriculation] }),
              relNom: [rel.relNom], relPrenom: [rel.relPrenom],
              relDtNaissance: [rel.relDtNaissance], relAnNaissance: [rel.relAnNaissance],
              relSexe: [rel.relSexe], relEtat: [rel.relEtat]
            }));
          });
        }

        // Remplissage des services
        this.services.clear();
        if (data.services) {
          data.services.forEach((srv: any) => {
            this.services.push(this.fb.group({
              id: this.fb.group({
                tserTrvImmatriculation: [srv.id?.tserTrvImmatriculation],
                tserDtEmbauche: [srv.id?.tserDtEmbauche],
                tserEmpSequence: [srv.id?.tserEmpSequence]
              }),
              tserAffiliation: [srv.tserAffiliation], tserDesignation: [srv.tserDesignation],
              tserTypeAss: [srv.tserTypeAss], tserEtat: [srv.tserEtat],
              tserMatricule: [srv.tserMatricule], tserEmpNom: [srv.tserEmpNom],
              tserSalaire: [srv.tserSalaire], tserDtFin: [srv.tserDtFin]
            }));
          });
        }

        // Si on est en mode suppression, on bloque tous les champs
        if (this.modeAction() === 'DELETE') {
          this.travailleurForm.disable();
          this.travailleurForm.get('trvImmatriculation')?.enable();
        } else {
          this.travailleurForm.enable();
        }
        
        this.isLoading.set(false);
      },
      error: (err) => {
        alert(err.status === 404 ? "Travailleur introuvable." : "Erreur lors de la recherche.");
        this.isLoading.set(false);
      }
    });
  }

  // ==========================================
  // SOUMISSION (CREATE / UPDATE / DELETE)
  // ==========================================
  onSubmit() {
    const immat = this.travailleurForm.getRawValue().trvImmatriculation;
    const currentMode = this.modeAction();

    this.isLoading.set(true);

    if (currentMode === 'CREATE') {
      if (this.travailleurForm.valid) {
        this.http.post(this.apiUrl, this.travailleurForm.getRawValue()).subscribe({
          next: (res: any) => {
            alert('Travailleur créé avec succès ! N°: ' + res.trvImmatriculation);
            this.resetForm();
            this.isLoading.set(false);
          },
          error: (err) => { alert('Erreur : ' + (err.error?.message || err.message)); this.isLoading.set(false); }
        });
      } else {
        this.isLoading.set(false);
      }
    } 
    
    else if (currentMode === 'UPDATE') {
      if (this.travailleurForm.valid) {
        this.http.put(`${this.apiUrl}/${immat}`, this.travailleurForm.getRawValue()).subscribe({
          next: (res) => { 
            alert('Travailleur mis à jour avec succès !'); 
            this.resetForm(); 
            this.isLoading.set(false); 
          },
          error: (err) => { 
            alert('Erreur de mise à jour : ' + (err.error?.message || err.message)); 
            this.isLoading.set(false); 
          }
        });
      } else {
        this.isLoading.set(false);
        alert('Veuillez corriger les erreurs dans le formulaire.');
      }
    } 
    
    else if (currentMode === 'DELETE') {
      if (confirm(`Voulez-vous vraiment supprimer le travailleur ${immat} ?`)) {
        this.http.delete(`${this.apiUrl}/${immat}`).subscribe({
          next: () => { 
            alert('Travailleur supprimé avec succès.'); 
            this.resetForm(); 
            this.isLoading.set(false); 
          },
          error: (err) => { 
            alert('Erreur de suppression : ' + (err.error?.message || err.message)); 
            this.isLoading.set(false); 
          }
        });
      } else {
        this.isLoading.set(false);
      }
    }
  }

  // ==========================================
  // RÉINITIALISATION
  // ==========================================
  resetForm() {
    this.travailleurForm.reset();
    this.relations.clear();
    this.services.clear();
    this.travailleurCharge.set(null);
    this.employeursTrouves.set({}); // <-- On vide le signal des employeurs
    
    if (this.modeAction() === 'CREATE') {
      this.travailleurForm.get('trvImmatriculation')?.disable();
    } else {
      this.travailleurForm.get('trvImmatriculation')?.enable();
      this.travailleurForm.get('trvImmatriculation')?.setValue('');
    }
  }
}