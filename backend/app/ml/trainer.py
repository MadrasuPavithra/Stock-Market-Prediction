import torch
import torch.nn as nn
from app.ml.informer import InformerForecaster

def get_criterion():
    return nn.HuberLoss()
    
def get_optimizer(model: nn.Module, lr: float):
    return torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)

def get_scheduler(optimizer, epochs: int):
    return torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

def train_epoch(model: nn.Module, loader, optimizer, criterion, device):
    model.train()
    total_loss = 0
    for batch_x, batch_y in loader:
        batch_x, batch_y = batch_x.to(device), batch_y.to(device)
        
        optimizer.zero_grad()
        preds = model(batch_x)
        loss = criterion(preds, batch_y)
        loss.backward()
        
        # Gradient Clipping
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()
        
        total_loss += loss.item()
        
    return total_loss / len(loader)

def eval_epoch(model: nn.Module, loader, criterion, device):
    model.eval()
    total_loss = 0
    with torch.no_grad():
        for batch_x, batch_y in loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            preds = model(batch_x)
            loss = criterion(preds, batch_y)
            total_loss += loss.item()
            
    return total_loss / len(loader)
