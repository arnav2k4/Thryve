import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load dataset
df = pd.read_excel(r"C:\Users\Param\Desktop\Hackathons\STARTUP\Dummy_Employee_Data_325.xlsx")

# Map Burnout to binary
df['Signs of Burnout'] = df['Signs of Burnout'].map({'No': 0, 'Yes': 1})

# Generate target column
df['Company Failure'] = df.apply(
    lambda row: 1 if (
        row['Signs of Burnout'] == 1 and
        row['Job Satisfaction (1 to 5)'] <= 2 and
        row['Average Weekly Work Hours'] > 50 and
        row['Recent Feedback Score (1–10)'] <= 4
    ) else 0,
    axis=1
)

# Add Employee ID if not present
if 'Employee ID' not in df.columns:
    df['Employee ID'] = range(1001, 1001 + len(df))

# Define features and target
features = [
    "Job Satisfaction (1 to 5)",
    "Years Since Last Promotion",
    "Current Salary (INR/month)",
    "Average Weekly Work Hours",
    "Signs of Burnout",
    "Recent Feedback Score (1–10)"
]
X = df[features]
y = df["Company Failure"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# --- 📌 Risk Analysis Based on Employee ID ---
def risk_report(employee_id):
    if employee_id not in df['Employee ID'].values:
        print(f"❌ Employee ID {employee_id} not found.")
        return
    
    emp_row = df[df['Employee ID'] == employee_id].iloc[0]
    features_row = emp_row[features]
    risk_score = model.predict_proba(features_row.to_frame().T)[0][1]
    
    print(f"\n📋 Risk Report for Employee ID: {employee_id}")
    print(f"🧠 Risk Score (Probability of Failure): {risk_score:.2%}")

    # Classify risk level
    if risk_score >= 0.7:
        risk_level = "🔴 High Risk"
    elif risk_score >= 0.4:
        risk_level = "🟠 Moderate Risk"
    else:
        risk_level = "🟢 Low Risk"
    print(f"📉 Classification: {risk_level}")
    
    # Identify risk factors
    risk_factors = []
    if emp_row["Job Satisfaction (1 to 5)"] <= 2:
        risk_factors.append("Low job satisfaction")
    if emp_row["Average Weekly Work Hours"] > 50:
        risk_factors.append("Long work hours")
    if emp_row["Years Since Last Promotion"] > 3:
        risk_factors.append("Stagnant promotion")
    if emp_row["Recent Feedback Score (1–10)"] <= 4:
        risk_factors.append("Low feedback score")
    if emp_row["Signs of Burnout"] == 1:
        risk_factors.append("Signs of burnout")
    if emp_row["Current Salary (INR/month)"] < df["Current Salary (INR/month)"].median():
        risk_factors.append("Lower than median salary")

    print("🚩 Top Risk Factors:")
    for factor in risk_factors[:3]:
        print(f"   - {factor}")
    
    # Tailored suggestions
    print("✅ Suggestions:")
    for factor in risk_factors[:3]:
        if "job satisfaction" in factor:
            if risk_score >= 0.7:
                print("   ➤ Immediate team counseling and project reassignment recommended.")
            elif risk_score >= 0.4:
                print("   ➤ Explore new project roles and give recognition.")
            else:
                print("   ➤ Encourage feedback and review current responsibilities.")
        elif "work hours" in factor:
            if risk_score >= 0.7:
                print("   ➤ Urgently rebalance workload and enforce work-hour limits.")
            else:
                print("   ➤ Monitor hours and encourage regular breaks.")
        elif "promotion" in factor:
            if risk_score >= 0.7:
                print("   ➤ Initiate career development planning with HR.")
            else:
                print("   ➤ Offer mentoring and training opportunities.")
        elif "feedback" in factor:
            if risk_score >= 0.7:
                print("   ➤ Conduct 1-on-1 performance review and address concerns.")
            else:
                print("   ➤ Give more frequent feedback and coaching.")
        elif "burnout" in factor:
            if risk_score >= 0.7:
                print("   ➤ Immediate intervention: mental health support and time off.")
            else:
                print("   ➤ Recommend wellness programs and flexible hours.")
        elif "salary" in factor:
            if risk_score >= 0.7:
                print("   ➤ Discuss compensation gaps and conduct salary review.")
            else:
                print("   ➤ Evaluate parity and offer perks if needed.")

a=input("Enter Employee ID:")

risk_report("EMP"+a) 
