import optuna
import torch
import torch.nn as nn
from app.ml.informer import InformerForecaster
from app.ml.trainer import get_criterion, get_optimizer, train_epoch, eval_epoch

def run_bayesian_optimization(input_dim: int, train_loader, val_loader, n_trials=20, epochs_per_trial=10):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    def objective(trial):
        d_model = trial.suggest_categorical('d_model', [32, 64, 128])
        n_heads = trial.suggest_categorical('n_heads', [2, 4, 8])
        
        # heads must divide d_model cleanly
        if d_model % n_heads != 0:
            raise optuna.exceptions.TrialPruned()
            
        d_ff = trial.suggest_categorical('d_ff', [128, 256, 512])
        n_layers = trial.suggest_int('n_layers', 1, 3)
        dropout = trial.suggest_float('dropout', 0.05, 0.3)
        lr = trial.suggest_float('lr', 1e-4, 1e-2, log=True)
        # Note: Batch size is handled outside in the loader, but we log it as a parameter conceptually if we recreated loaders
        
        model = InformerForecaster(input_dim, d_model, n_heads, d_ff, n_layers, dropout).to(device)
        criterion = get_criterion()
        optimizer = get_optimizer(model, lr)
        
        best_val = float('inf')
        for epoch in range(epochs_per_trial):
            train_epoch(model, train_loader, optimizer, criterion, device)
            val_loss = eval_epoch(model, val_loader, criterion, device)
            
            if val_loss < best_val:
                best_val = val_loss
                
            # Report intermediate value for early pruning
            trial.report(val_loss, epoch)
            if trial.should_prune():
                raise optuna.exceptions.TrialPruned()
                
        return best_val

    # Use TPE Sampler with seed 42 as requested
    study = optuna.create_study(direction="minimize", sampler=optuna.samplers.TPESampler(seed=42))
    study.optimize(objective, n_trials=n_trials)
    
    return study.best_params, study.best_value
