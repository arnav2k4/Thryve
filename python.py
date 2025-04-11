import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# ----- 🔧 CONFIG -----
FEATURES = [
    "Job Satisfaction (1 to 5)",
    "Years Since Last Promotion",
    "Current Salary (INR/month)",
    "Average Weekly Work Hours",
    "Signs of Burnout",
    "Recent Feedback Score (1–10)"
]

LABEL = "Company Failure"

# ----- 🧠 LOAD & PREPROCESS -----
def load_and_prepare_data(filepath):
    df = pd.read_excel(filepath)

    df['Signs of Burnout'] = df['Signs of Burnout'].map({'No': 0, 'Yes': 1})

    # Create binary 'Company Failure'
    df[LABEL] = df.apply(
        lambda row: 1 if (
            row['Signs of Burnout'] == 1 and
            row['Job Satisfaction (1 to 5)'] <= 2 and
            row['Average Weekly Work Hours'] > 50 and
            row['Recent Feedback Score (1–10)'] <= 4
        ) else 0, axis=1
    )

    return df

# ----- 🎯 TRAIN MODEL -----
def train_model(df):
    X = df[FEATURES]
    y = df[LABEL]

    X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save model
    joblib.dump(model, "company_failure_model.pkl")

    # Evaluate
    y_pred = model.predict(X_test)
    print("\n🔬 Evaluation:")
    print(classification_report(y_test, y_pred))

    return model

# ----- 🔍 PREDICT FOR NEW EMPLOYEE -----
def predict_failure_risk(employee_info: dict):
    model = joblib.load("company_failure_model.pkl")
    input_df = pd.DataFrame([employee_info])

    risk_score = model.predict_proba(input_df)[0][1]  # probability of failure
    risk_label = (
        "High" if risk_score > 0.6 else
        "Medium" if risk_score > 0.3 else
        "Low"
    )

    return {
        "Failure Risk (%)": round(risk_score * 100, 2),
        "Risk Category": risk_label
    }

# ----- 🧪 RUN -----
if _name_ == "__main__":
    df = load_and_prepare_data(r"C:\Users\arnav\Desktop\Arnav\Tech_Talent\Dummy_Employee_Data_325.xlsx")
    train_model(df)

    # 🔧 Sample usage
    sample_employee = {
        "Job Satisfaction (1 to 5)": 2,
        "Years Since Last Promotion": 3,
        "Current Salary (INR/month)": 60000,
        "Average Weekly Work Hours": 55,
        "Signs of Burnout": 1,
        "Recent Feedback Score (1–10)": 3
    }

    result = predict_failure_risk(sample_employee)
    print("\n📈 Risk Prediction:", result)