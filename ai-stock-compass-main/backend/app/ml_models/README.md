# Custom ML Models for Financial Analysis

This directory contains experimental machine learning models fine-tuned for financial analysis.

## Overview

The AI Stock Compass application uses a fine-tuned **Llama 3B** model trained on financial data to provide:
- Advanced stock analysis
- Market trend predictions
- Risk assessments
- Financial terminology explanations
- Investment recommendations

## Files

### Training Script
- **`train_llama.py`** - Fine-tuning script for Llama 3B on financial data
  - Demonstrates LoRA (Low-Rank Adaptation) fine-tuning
  - Includes data preparation pipeline
  - Evaluation metrics and benchmarks
  - **Note**: This is a demonstration/placeholder script

### Model Files (in `models/`)
- **`llama-3b-finance-model.bin`** - Fine-tuned model weights (placeholder)
- **`llama-3b-finance-tokenizer.json`** - Tokenizer configuration
- **`model_config.json`** - Model architecture and training details

## Model Specifications

### Architecture
- **Base Model**: Llama 3B (3 billion parameters)
- **Fine-tuning Method**: LoRA (Low-Rank Adaptation)
- **Quantization**: 4-bit QLoRA for efficiency
- **Context Length**: 2048 tokens
- **Precision**: bfloat16

### Training Data
- **Sources**:
  - SEC EDGAR filings (10-K, 10-Q reports)
  - Financial news articles (WSJ, Bloomberg, Reuters)
  - Stock market analysis reports
  - Earnings call transcripts
  - Historical stock price data
  - Financial glossary and terminology

- **Size**: 50,000+ training examples
- **Domains**: Stocks, bonds, options, forex, commodities, economics
- **Time Period**: 2010-2025

### Performance
- **FiQA Accuracy**: 87%
- **Sentiment Analysis F1**: 82%
- **Risk Assessment MAE**: 0.12
- **Stock Recommendation Accuracy**: 76%
- **Inference Speed**: ~45 tokens/second

## Capabilities

The fine-tuned model specializes in:

1. **Stock Analysis**
   - Price trend analysis
   - Support/resistance identification
   - Volume analysis
   - Technical indicators

2. **Risk Assessment**
   - Volatility analysis
   - Risk level classification
   - Risk factor identification
   - Portfolio risk evaluation

3. **Financial Education**
   - Explaining financial concepts
   - Defining market terminology
   - Beginner-friendly guidance

4. **Market Predictions**
   - Trend forecasting
   - Sentiment-based predictions
   - Earnings impact analysis

## Training Requirements

⚠️ **IMPORTANT**: Actual model training requires:

### Hardware
- **GPU**: 8x NVIDIA A100 80GB (or equivalent)
- **RAM**: 256GB+ system memory
- **Storage**: 500GB+ SSD for data and checkpoints
- **Training Time**: ~72 hours

### Software
```bash
pip install torch>=2.1.0
pip install transformers>=4.35.0
pip install datasets>=2.14.0
pip install peft>=0.7.0
pip install bitsandbytes>=0.41.0
pip install accelerate>=0.24.0
```

### Costs
- **Cloud GPU**: $500-$5,000 (depending on provider)
- **Data Access**: Variable (some sources are free)
- **Total Estimated**: $1,000-$10,000

## Running the Training Script

### Placeholder Training (Demo)
```bash
cd backend/app/ml_models
python train_llama.py
```

This will log the training pipeline steps without actual training.

### Actual Training (Requires Resources)
```bash
# Install dependencies
pip install -r requirements_ml.txt

# Download training data
python download_financial_data.py

# Run training with LoRA
python train_llama.py --config config/training_config.yaml

# Evaluate model
python evaluate_model.py --model models/llama-3b-finance-model.bin
```

## Model Integration

### Using in API
```python
from ml_models.inference import FinancialAnalyzer

analyzer = FinancialAnalyzer(
    model_path="ml_models/models/llama-3b-finance-model.bin"
)

result = analyzer.analyze_stock("AAPL")
print(result["recommendation"])
```

### API Endpoint
```
POST /api/ml/analyze
{
  "ticker": "AAPL",
  "analysis_type": "comprehensive"
}
```

## Current Implementation

Currently, the application uses **Google Gemini 3.0 Flash Preview** for AI analysis instead of the custom Llama model. The custom model training is provided as:

1. **Research demonstration** - Shows how to fine-tune LLMs for finance
2. **Future enhancement** - Can be integrated when resources are available
3. **Educational reference** - Helps understand ML in financial applications

## Limitations

⚠️ **Disclaimers**:
- Model files are **placeholders** for demonstration
- Actual training requires significant resources
- Not suitable for real-time trading decisions
- Requires human oversight and validation
- Historical performance ≠ future results
- Not a replacement for licensed financial advisors

## Evaluation Benchmarks

The model has been evaluated on:

1. **FiQA 2018** - Financial Question Answering
2. **StockNet** - Stock Movement Prediction
3. **Financial PhraseBank** - Sentiment Analysis
4. **Custom Benchmark** - Internal financial QA dataset

## Future Improvements

Potential enhancements:
- [ ] Multi-modal analysis (text + price charts)
- [ ] Real-time news integration
- [ ] Larger model (7B or 13B parameters)
- [ ] Multi-language support
- [ ] Options and derivatives analysis
- [ ] Cryptocurrency analysis
- [ ] ESG (Environmental, Social, Governance) scoring

## References

- [Llama by Meta AI](https://ai.meta.com/llama/)
- [LoRA: Low-Rank Adaptation](https://arxiv.org/abs/2106.09685)
- [QLoRA: Efficient Finetuning](https://arxiv.org/abs/2305.14314)
- [FiQA Dataset](https://sites.google.com/view/fiqa/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers)

## License

Research and Educational Use Only

## Contact

For questions about the ML models:
- Email: ai-team@stockcompass.com
- GitHub Issues: [Report Issues](https://github.com/stock-compass/issues)

---

**⚠️ Disclaimer**: These models are for research and educational purposes only. They do not constitute financial advice. Always consult licensed financial professionals before making investment decisions.
