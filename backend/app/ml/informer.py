import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 1000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0)
        self.register_buffer('pe', pe)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """ x form: (Batch, SeqLen, Features) """
        return x + self.pe[:, :x.size(1)]

class ProbSparseAttention(nn.Module):
    """
    Simulated ProbSparse Attention representation. 
    In O(L log L), top-u queries are selected. For brevity and compatibility,
    we use a standard MultiheadAttention but restrict computation context logic if needed.
    """
    def __init__(self, d_model: int, n_heads: int, dropout: float):
        super().__init__()
        self.mha = nn.MultiheadAttention(embed_dim=d_model, num_heads=n_heads, dropout=dropout, batch_first=True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Self-attention over (Batch, Seq, Features)
        attn_output, _ = self.mha(x, x, x)
        return attn_output

class InformerEncoderLayer(nn.Module):
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float):
        super().__init__()
        self.attention = ProbSparseAttention(d_model, n_heads, dropout)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        attn_out = self.attention(x)
        x = self.norm1(x + self.dropout(attn_out))
        ffn_out = self.ffn(x)
        x = self.norm2(x + self.dropout(ffn_out))
        return x

class InformerForecaster(nn.Module):
    def __init__(self, input_dim: int, d_model: int, n_heads: int, d_ff: int, n_layers: int, dropout: float):
        super().__init__()
        self.embedding = nn.Linear(input_dim, d_model)
        self.pos_encoder = PositionalEncoding(d_model)
        
        self.layers = nn.ModuleList([
            InformerEncoderLayer(d_model, n_heads, d_ff, dropout) for _ in range(n_layers)
        ])
        
        # Self-Distilling layer: MaxPool halves the sequence length
        self.pool = nn.MaxPool1d(kernel_size=2, stride=2)
        
        # Regression Head
        self.regression_head = nn.Sequential(
            nn.Linear(d_model, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, 1) # Predict single next-day closing price
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: (Batch, SeqLen, Features)
        x = self.embedding(x)
        x = self.pos_encoder(x)
        
        for layer in self.layers:
            x = layer(x)
            
            # Distilling: Apply MaxPool across sequence length for each layer output. 
            # Require transposing because pool 1d acts on last dim.
            if x.size(1) > 1:
                x = x.transpose(1, 2)
                x = self.pool(x)
                x = x.transpose(1, 2)
        
        # Global Pooling over time dimension
        x = torch.mean(x, dim=1) # Shape: (Batch, d_model)
        
        # Output next price
        out = self.regression_head(x)
        return out.squeeze() # Shape: (Batch,)
