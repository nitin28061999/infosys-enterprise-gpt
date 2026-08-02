import sys
import os
import platform
import asyncio

# Fix for Windows asyncio ConnectionResetError (WinError 10054)
if platform.system() == 'Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
import sys
import os

# Add project root directory to Python system path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Existing imports follow below:
import streamlit as st
from dotenv import load_dotenv

load_dotenv()
from ai_workflows.grounded_synthesis.synthesis_engine import EnterpriseGroundedEngine
from ai_workflows.query_classification.rbac_classifier import ROLE_PERMISSIONS
import streamlit as st
from dotenv import load_dotenv

load_dotenv()
# Import Grounded Synthesis Engine
from ai_workflows.grounded_synthesis.synthesis_engine import EnterpriseGroundedEngine
# Import ROLE_PERMISSIONS from rbac_classifier
from ai_workflows.query_classification.rbac_classifier import ROLE_PERMISSIONS

# Page Configuration & UI Theme
st.set_page_config(
    page_title="Infosys AI Knowledge Assistant",
    page_icon="🤖",
    layout="wide"
)

st.title("🤖 Infosys AI Knowledge Assistant")
st.caption("Enterprise GPT for internal knowledge, citation-backed discovery, and productivity.")

# Initialize Grounded Synthesis Engine
@st.cache_resource
def load_engine():
    api_key = os.getenv("GOOGLE_API_KEY")
    return EnterpriseGroundedEngine(google_api_key=api_key)

try:
    engine = load_engine()
except Exception as e:
    st.error(f"Failed to initialize Engine. Ensure GOOGLE_API_KEY is set. Error: {e}")
    st.stop()

# Sidebar: User Session Context & Governance Controls
with st.sidebar:
    st.header("👤 User Session Identity")
    designation_list = list(ROLE_PERMISSIONS.keys())
    user_designation = st.selectbox(
        "Select Your Employee Designation:",
        options=designation_list,
        index=0
    )
    st.markdown("---")
    st.header("⚙️ System Status")
    st.success("Vector DB: Persistent Chroma Connected")
    st.info("Grounding Model: Gemini 2.5 Flash (T=0.0)")

# Main Query Workspace
col1, col2 = st.columns([1.2, 0.8])

with col1:
    st.subheader("💬 Employee Query Workspace")
    user_query = st.text_input(
        "Ask a question across SOPs, policies, guides, or manuals:",
        placeholder="e.g., What is the response SLA for Severity 1 incidents?"
    )
    submit_btn = st.button("Submit Query", type="primary", use_container_width=True)

    if submit_btn and user_query:
        with st.spinner(f"Retrieving grounded context for '{user_designation}'..."):
            response = engine.generate_response(query=user_query, designation=user_designation)

        st.markdown("### 📝 Grounded Answer")
        st.write(response.get("answer"))
        st.markdown(f"**Confidence Score:** `{response.get('confidence_score')}`")
        st.info(f"**Recommended Action:** {response.get('recommended_action')}")

with col2:
    st.subheader("📌 Citation & Source Panel")
    if submit_btn and user_query:
        citations = response.get("citations", [])
        if not citations:
            st.warning("No explicit citation sources returned for this query.")
        else:
            for idx, cite in enumerate(citations, 1):
                with st.expander(f"[{idx}] {cite.get('document_name')} (Page {cite.get('page_number')})"):
                    st.markdown(f"**Department:** `{cite.get('department')}`")
                    st.markdown(f"**Matched Passage:**\n> *\"{cite.get('matched_passage')}\"*")

st.markdown("---")
st.caption("Infosys AI Knowledge Assistant | Enterprise GPT Platform v1.0")
