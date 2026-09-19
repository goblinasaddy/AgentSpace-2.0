"use client";

import { useState, useEffect } from "react";
import {
  FolderGit2,
  Play,
  ShieldCheck,
  Plus,
  Terminal,
  Activity,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Swords,
  GitFork,
  MessageSquare,
  GitPullRequest,
  Lock,
  UserCheck,
  LogOut,
  Star,
  Award,
} from "lucide-react";

export default function HomePage() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "repositories" | "create" | "runtime" | "marketplace" | "battles" | "verification" | "collaboration"
  >("repositories");

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState("developer@agentspace.dev");
  const [authUsername, setAuthUsername] = useState("devuser");
  const [authPassword, setAuthPassword] = useState("Password123!");
  const [authError, setAuthError] = useState<string | null>(null);

  // Repositories State
  const [repositories, setRepositories] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoSlug, setNewRepoSlug] = useState("");
  const [newRepoDesc, setNewRepoDesc] = useState("");

  // Agents & Version Publisher State
  const [selectedRepoId, setSelectedRepoId] = useState<string>("");
  const [agents, setAgents] = useState<any[]>([]);
  const [newAgentName, setNewAgentName] = useState("code-reviewer");
  const [newAgentDesc, setNewAgentDesc] = useState("Automated code auditing agent.");
  const [yamlSpec, setYamlSpec] = useState(`apiVersion: agentspace/v1
kind: Agent
metadata:
  name: technical-analyst
  version: 1.0.0
  description: Autonomous code review and architecture analysis agent.
  categories:
    - engineering
  tags:
    - code-review
    - security
spec:
  type: input-output
  runtime:
    provider: gemini
    model: gemini-2.5-flash
    systemPrompt: You are a Lead Software Architect auditing system code.
  input:
    schema:
      type: object
      properties:
        codeSnippet:
          type: string
  output:
    schema:
      type: object
      properties:
        analysis:
          type: string
  capabilities:
    - static_analysis
    - security_screening
  permissions:
    network: false
    filesystem: false`);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  // Execution State
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [inputData, setInputData] = useState(`{\n  "codeSnippet": "function auth(u, p) { return u === 'admin' && p === 'secret'; }"\n}`);
  const [activeRun, setActiveRun] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runStatusText, setRunStatusText] = useState<string>("");

  // Marketplace State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Battles State
  const [battles, setBattles] = useState<any[]>([]);
  const [newChallenge, setNewChallenge] = useState("Analyze code snippet for security vulnerabilities and give recommendations.");
  const [battleAgentA, setBattleAgentA] = useState("");
  const [battleAgentB, setBattleAgentB] = useState("");

  // Verification State
  const [verificationRequests, setVerificationRequests] = useState<any[]>([]);

  // Collaboration (Issues & PRs) State
  const [collabRepoId, setCollabRepoId] = useState<string>("");
  const [issues, setIssues] = useState<any[]>([]);
  const [pulls, setPulls] = useState<any[]>([]);
  const [newIssueTitle, setNewIssueTitle] = useState("");
  const [newIssueBody, setNewIssueBody] = useState("");

  useEffect(() => {
    // Restore session token if present
    const savedToken = localStorage.getItem("agentspace_token");
    if (savedToken) {
      setAuthToken(savedToken);
      fetchAuthUser(savedToken);
    }
    fetchRepositories();
  }, []);

  useEffect(() => {
    if (repositories.length > 0 && !selectedRepoId) {
      setSelectedRepoId(repositories[0].id);
      setCollabRepoId(repositories[0].id);
    }
  }, [repositories]);

  useEffect(() => {
    if (selectedRepoId) {
      fetchAgents(selectedRepoId);
    }
  }, [selectedRepoId]);

  useEffect(() => {
    if (collabRepoId) {
      fetchIssuesAndPulls(collabRepoId);
    }
  }, [collabRepoId]);

  // Auth Helpers
  const handleRegisterOrLogin = async (isLogin: boolean) => {
    setAuthError(null);
    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const body = isLogin
        ? { email: authEmail, password: authPassword }
        : { email: authEmail, username: authUsername, password: authPassword, displayName: authUsername };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Authentication failed.");
      }

      const token = data.data.token;
      setAuthToken(token);
      localStorage.setItem("agentspace_token", token);
      setAuthUser(data.data.user);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const fetchAuthUser = async (token: string) => {
    try {
      const res = await fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAuthUser(data.data);
      } else {
        localStorage.removeItem("agentspace_token");
        setAuthToken(null);
      }
    } catch {
      localStorage.removeItem("agentspace_token");
      setAuthToken(null);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem("agentspace_token");
  };

  // Repositories API
  const fetchRepositories = async () => {
    setIsLoadingRepos(true);
    setRepoError(null);
    try {
      const res = await fetch("/api/v1/repositories");
      const data = await res.json();
      if (res.ok) {
        setRepositories(data.data || []);
      } else {
        setRepoError(data.error?.message || "Failed to fetch repositories.");
      }
    } catch {
      setRepoError("Network error while connecting to AgentSpace API.");
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleCreateRepository = async () => {
    if (!authToken) {
      setRepoError("Please log in to create a repository.");
      return;
    }
    setRepoError(null);
    try {
      const res = await fetch("/api/v1/repositories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: newRepoName || "my-agent-repo",
          slug: newRepoSlug || `repo-${Date.now()}`,
          description: newRepoDesc || "Agent repository",
          visibility: "PUBLIC",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewRepoName("");
        setNewRepoSlug("");
        setNewRepoDesc("");
        fetchRepositories();
      } else {
        setRepoError(data.error?.message || "Failed to create repository.");
      }
    } catch (err: any) {
      setRepoError(err.message);
    }
  };

  const handleForkRepository = async (repoId: string) => {
    if (!authToken) {
      setRepoError("Please log in to fork a repository.");
      return;
    }
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/fork`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ customSlug: `fork-${Date.now()}` }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchRepositories();
      } else {
        alert(`Fork Failed: ${data.error?.message}`);
      }
    } catch (err: any) {
      alert(`Fork Error: ${err.message}`);
    }
  };

  // Agents API
  const fetchAgents = async (repoId: string) => {
    try {
      const res = await fetch(`/api/v1/agents?repositoryId=${repoId}`);
      const data = await res.json();
      if (res.ok) {
        setAgents(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedAgentId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  const handleCreateAgent = async () => {
    if (!authToken || !selectedRepoId) return;
    try {
      const res = await fetch("/api/v1/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          repositoryId: selectedRepoId,
          name: newAgentName,
          description: newAgentDesc,
          type: "INPUT_OUTPUT",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAgents(selectedRepoId);
      } else {
        alert(`Agent Creation Failed: ${data.error?.message}`);
      }
    } catch (err: any) {
      alert(`Agent Error: ${err.message}`);
    }
  };

  const handlePublishVersion = async () => {
    if (!authToken || !selectedAgentId) {
      setPublishStatus("Error: Must be logged in and select an Agent to publish a version.");
      return;
    }
    setPublishStatus("Publishing version via API...");
    try {
      const res = await fetch(`/api/v1/agents/${selectedAgentId}/versions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          version: "1.0.0",
          yamlSpec: yamlSpec,
          releaseNotes: "Initial published release",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPublishStatus(`Success! Published Version ${data.data.version} (ID: ${data.data.id})`);
        fetchAgents(selectedRepoId);
      } else {
        setPublishStatus(`Failed: ${data.error?.message || "Publish rejected by backend."}`);
      }
    } catch (err: any) {
      setPublishStatus(`Error: ${err.message}`);
    }
  };

  // Real Run Execution & Interval Polling
  const handleExecute = async () => {
    if (!selectedAgentId) {
      setRunStatusText("Error: Please select an Agent to run.");
      return;
    }
    setIsExecuting(true);
    setActiveRun(null);
    setRunStatusText("Submitting execution job (POST /api/v1/agents/[id]/runs)...");

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const res = await fetch(`/api/v1/agents/${selectedAgentId}/runs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ input: JSON.parse(inputData) }),
      });

      const data = await res.json();

      if (res.status === 202 && data.data) {
        const runId = data.data.id;
        setRunStatusText(`Job enqueued (HTTP 202 Accepted, runId: ${runId}). Polling backend status...`);

        // Real Polling Loop
        let attempts = 0;
        const maxPolls = 20;

        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const pollRes = await fetch(`/api/v1/runs/${runId}`);
            const pollData = await pollRes.json();

            if (pollRes.ok && pollData.data) {
              const currentRun = pollData.data;
              setActiveRun(currentRun);

              if (currentRun.status === "COMPLETED" || currentRun.status === "FAILED" || currentRun.status === "TIMED_OUT") {
                clearInterval(pollInterval);
                setIsExecuting(false);
                setRunStatusText(`Run Finished with Status: ${currentRun.status}`);
              } else {
                setRunStatusText(`Polling runId: ${runId} (Status: ${currentRun.status}, attempt ${attempts})...`);
              }
            }
          } catch (pollErr: any) {
            console.error("Polling error:", pollErr);
          }

          if (attempts >= maxPolls) {
            clearInterval(pollInterval);
            setIsExecuting(false);
            setRunStatusText("Polling timeout reached.");
          }
        }, 800);
      } else {
        setRunStatusText(`Execution Error: ${data.error?.message || "Job submission failed."}`);
        setIsExecuting(false);
      }
    } catch (err: any) {
      setRunStatusText(`Submission Error: ${err.message}`);
      setIsExecuting(false);
    }
  };

  // Marketplace Search API
  const handleMarketplaceSearch = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/v1/marketplace/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.data || []);
      }
    } catch (err) {
      console.error("Marketplace search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Battles API
  const fetchBattles = async () => {
    try {
      const res = await fetch("/api/v1/battles");
      const data = await res.json();
      if (res.ok) {
        setBattles(data.data || []);
      }
    } catch (err) {
      console.error("Fetch battles error:", err);
    }
  };

  const handleCreateBattle = async () => {
    if (!authToken || !battleAgentA || !battleAgentB) return;
    try {
      const res = await fetch("/api/v1/battles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          challenge: newChallenge,
          participantVersionIds: [battleAgentA, battleAgentB],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchBattles();
      } else {
        alert(`Battle Creation Failed: ${data.error?.message}`);
      }
    } catch (err: any) {
      alert(`Battle Error: ${err.message}`);
    }
  };

  // Verification API
  const handleRequestVerification = async (versionId: string) => {
    if (!authToken) {
      alert("Please log in to request verification.");
      return;
    }
    try {
      const res = await fetch("/api/v1/verification/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          agentVersionId: versionId,
          requestedBadges: ["SECURITY_SCREENED", "RELIABILITY_VERIFIED"],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVerificationRequests((prev) => [data.data, ...prev]);
        alert("Verification Request Created Successfully!");
      } else {
        alert(`Verification Failed: ${data.error?.message}`);
      }
    } catch (err: any) {
      alert(`Verification Error: ${err.message}`);
    }
  };

  // Collaboration API (Issues & PRs)
  const fetchIssuesAndPulls = async (repoId: string) => {
    try {
      const [issuesRes, pullsRes] = await Promise.all([
        fetch(`/api/v1/repositories/${repoId}/issues`),
        fetch(`/api/v1/repositories/${repoId}/pulls`),
      ]);
      const issuesData = await issuesRes.json();
      const pullsData = await pullsRes.json();
      if (issuesRes.ok) setIssues(issuesData.data || []);
      if (pullsRes.ok) setPulls(pullsData.data || []);
    } catch (err) {
      console.error("Fetch collaboration error:", err);
    }
  };

  const handleCreateIssue = async () => {
    if (!authToken || !collabRepoId || !newIssueTitle) return;
    try {
      const res = await fetch(`/api/v1/repositories/${collabRepoId}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: newIssueTitle,
          body: newIssueBody || "Issue details",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewIssueTitle("");
        setNewIssueBody("");
        fetchIssuesAndPulls(collabRepoId);
      } else {
        alert(`Issue Creation Failed: ${data.error?.message}`);
      }
    } catch (err: any) {
      alert(`Issue Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-[#121215] via-[#18181b] to-[#121215] border border-[#27272a]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">AgentSpace 2.0 Ecosystem Platform</h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Real Backend Wired
            </span>
          </div>
          <p className="text-sm text-[#a1a1aa]">
            The Home for AI Agents: Build → Publish → Discover → Run → Evaluate → Battle → Fork → Verify
          </p>
        </div>

        {/* User Auth Status Pill */}
        <div className="flex items-center space-x-3">
          {authUser ? (
            <div className="flex items-center space-x-3 bg-[#18181b] p-2 rounded-lg border border-[#27272a]">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> {authUser.username}
              </span>
              <button onClick={handleLogout} className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-[#18181b] p-2 rounded-lg border border-[#27272a]">
              <input
                type="text"
                placeholder="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-28 px-2 py-1 text-xs bg-[#09090b] text-white border border-[#27272a] rounded"
              />
              <input
                type="password"
                placeholder="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-24 px-2 py-1 text-xs bg-[#09090b] text-white border border-[#27272a] rounded"
              />
              <button
                onClick={() => handleRegisterOrLogin(true)}
                className="px-2 py-1 text-xs bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded font-mono"
              >
                Login
              </button>
              <button
                onClick={() => handleRegisterOrLogin(false)}
                className="px-2 py-1 text-xs bg-[#27272a] hover:bg-[#3f3f46] text-white rounded font-mono"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {authError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {authError}
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#27272a] pb-3">
        <button
          onClick={() => setActiveTab("repositories")}
          className={`px-4 py-2 rounded-lg text-xs font-medium font-mono flex items-center space-x-2 ${
            activeTab === "repositories" ? "bg-[#8b5cf6] text-white" : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" /> <span>Repositories & Agents</span>
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-lg text-xs font-medium font-mono flex items-center space-x-2 ${
            activeTab === "create" ? "bg-[#8b5cf6] text-white" : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
          }`}
        >
          <Plus className="w-3.5 h-3.5" /> <span>Publish Version</span>
        </button>

        <button
          onClick={() => setActiveTab("runtime")}
          className={`px-4 py-2 rounded-lg text-xs font-medium font-mono flex items-center space-x-2 ${
            activeTab === "runtime" ? "bg-[#8b5cf6] text-white" : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
          }`}
        >
          <Play className="w-3.5 h-3.5" /> <span>Async Run Workspace</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("marketplace");
            handleMarketplaceSearch();
          }}
          className={`px-4 py-2 rounded-lg text-xs font-medium font-mono flex items-center space-x-2 ${
            activeTab === "marketplace" ? "bg-[#8b5cf6] text-white" : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
          }`}
        >
          <Search className="w-3.5 h-3.5" /> <span>Marketplace Discovery</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("battles");
            fetchBattles();
          }}
          className={`px-4 py-2 rounded-lg text-xs font-medium font-mono flex items-center space-x-2 ${
            activeTab === "battles" ? "bg-[#8b5cf6] text-white" : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
          }`}
        >
          <Swords className="w-3.5 h-3.5" /> <span>Battle Mode</span>
        </button>

        <button
          onClick={() => setActiveTab("verification")}
          className={`px-4 py-2 rounded-lg text-xs font-medium font-mono flex items-center space-x-2 ${
            activeTab === "verification" ? "bg-[#8b5cf6] text-white" : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
          }`}
        >
          <Award className="w-3.5 h-3.5" /> <span>Verification & Badges</span>
        </button>

        <button
          onClick={() => setActiveTab("collaboration")}
          className={`px-4 py-2 rounded-lg text-xs font-medium font-mono flex items-center space-x-2 ${
            activeTab === "collaboration" ? "bg-[#8b5cf6] text-white" : "bg-[#18181b] text-[#a1a1aa] hover:text-white"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> <span>Issues & Pull Requests</span>
        </button>
      </div>

      {/* Tab 1: Repositories & Agents */}
      {activeTab === "repositories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#8b5cf6]" /> Persistent Repositories Catalog
              </h2>
              <button onClick={fetchRepositories} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            {isLoadingRepos ? (
              <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center font-mono text-xs text-[#a1a1aa]">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#8b5cf6] mb-2" />
                Loading database records...
              </div>
            ) : repoError ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {repoError}
              </div>
            ) : repositories.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center font-mono text-xs text-[#a1a1aa]">
                No public repositories found. Create one below!
              </div>
            ) : (
              repositories.map((repo) => (
                <div key={repo.id} className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-base font-bold text-[#c4b5fd]">
                        {repo.owner.username}/{repo.slug}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/30">
                        {repo.visibility}
                      </span>
                    </div>
                    <button
                      onClick={() => handleForkRepository(repo.id)}
                      className="px-2.5 py-1 text-xs font-mono bg-[#27272a] hover:bg-[#3f3f46] text-white rounded flex items-center gap-1"
                    >
                      <GitFork className="w-3 h-3" /> Fork Repo
                    </button>
                  </div>
                  <p className="text-sm text-[#a1a1aa]">{repo.description || "No description provided."}</p>
                  <div className="flex items-center justify-between text-xs text-[#71717a] font-mono pt-2 border-t border-[#27272a]">
                    <span>Owner: {repo.owner.displayName || repo.owner.username}</span>
                    <span>Default Version: {repo.defaultVersion}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create Repository Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#8b5cf6]" /> Create Repository
            </h2>
            <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Repository Name</label>
                <input
                  type="text"
                  placeholder="e.g. security-auditor"
                  value={newRepoName}
                  onChange={(e) => {
                    setNewRepoName(e.target.value);
                    setNewRepoSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                  }}
                  className="w-full mt-1 p-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Slug</label>
                <input
                  type="text"
                  value={newRepoSlug}
                  onChange={(e) => setNewRepoSlug(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Description</label>
                <textarea
                  rows={2}
                  placeholder="Repository description..."
                  value={newRepoDesc}
                  onChange={(e) => setNewRepoDesc(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
                />
              </div>
              <button
                onClick={handleCreateRepository}
                className="w-full py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded font-mono text-xs font-medium"
              >
                Create Repository
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Agent Version Publisher */}
      {activeTab === "create" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8b5cf6]" /> Agent Specification & Immutable Version Publisher
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Select Target Repository</label>
                <select
                  value={selectedRepoId}
                  onChange={(e) => setSelectedRepoId(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#09090b] border border-[#27272a] text-xs text-white font-mono rounded"
                >
                  {repositories.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.slug} ({r.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-[#27272a] space-y-3">
                <h3 className="text-xs font-mono text-white font-bold uppercase">1. Create Agent Entry</h3>
                <div>
                  <label className="text-[11px] font-mono text-[#a1a1aa]">Agent Name</label>
                  <input
                    type="text"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#09090b] border border-[#27272a] text-xs text-white font-mono rounded"
                  />
                </div>
                <button
                  onClick={handleCreateAgent}
                  className="w-full py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-mono rounded"
                >
                  Create Agent Record
                </button>
              </div>

              <div className="pt-2 border-t border-[#27272a] space-y-3">
                <h3 className="text-xs font-mono text-white font-bold uppercase">2. Select Target Agent</h3>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#09090b] border border-[#27272a] text-xs text-white font-mono rounded"
                >
                  <option value="">-- Select Agent --</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a1a1aa] uppercase">YAML Specification</label>
              <textarea
                value={yamlSpec}
                onChange={(e) => setYamlSpec(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-xl bg-[#121215] border border-[#27272a] font-mono text-xs text-white focus:border-[#8b5cf6] focus:outline-none"
              />
              <button
                onClick={handlePublishVersion}
                className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs font-bold rounded-lg shadow-lg shadow-[#8b5cf6]/20"
              >
                Publish Immutable Agent Version via API
              </button>
              {publishStatus && (
                <div className="p-3 bg-[#09090b] border border-[#27272a] font-mono text-xs text-emerald-400 rounded-lg">
                  {publishStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Async Run Workspace */}
      {activeTab === "runtime" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#8b5cf6]" /> Async Agent Execution & Polling Workspace
            </h2>
            <span className="text-xs font-mono text-[#a1a1aa]">HTTP 202 Accepted → Interval Polling</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Select Agent to Run</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full mt-1 p-2 bg-[#121215] border border-[#27272a] text-xs text-white font-mono rounded-lg"
                >
                  <option value="">-- Select Agent --</option>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Input Payload (JSON)</label>
                <textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  rows={8}
                  className="w-full mt-1 p-4 rounded-xl bg-[#121215] border border-[#27272a] font-mono text-xs text-white focus:border-[#8b5cf6] focus:outline-none"
                />
              </div>

              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-mono text-xs font-bold rounded-lg flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isExecuting ? "Executing Async Job..." : "Enqueue Async Run Job"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a1a1aa] uppercase">Live Backend Run Output</label>
              <div className="w-full h-80 p-4 rounded-xl bg-[#09090b] border border-[#27272a] font-mono text-xs text-emerald-400 overflow-auto space-y-2">
                {runStatusText && <p className="text-amber-400 text-[11px]">// {runStatusText}</p>}
                <pre>{activeRun ? JSON.stringify(activeRun, null, 2) : "// Awaiting job execution submission..."}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Marketplace Discovery */}
      {activeTab === "marketplace" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-[#8b5cf6]" /> Marketplace Discovery System
          </h2>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search published agents by name, tag, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-[#121215] border border-[#27272a] text-xs text-white font-mono focus:border-[#8b5cf6] focus:outline-none"
            />
            <button
              onClick={handleMarketplaceSearch}
              className="px-5 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs rounded-xl"
            >
              Search Database
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {isSearching ? (
              <div className="col-span-2 text-center text-xs font-mono text-[#a1a1aa] py-8">Searching database...</div>
            ) : searchResults.length === 0 ? (
              <div className="col-span-2 text-center text-xs font-mono text-[#a1a1aa] py-8">
                No matching agents found in database search query.
              </div>
            ) : (
              searchResults.map((item) => (
                <div key={item.id} className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-sm font-bold text-[#c4b5fd]">{item.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#8b5cf6]/10 text-[#a78bfa] rounded">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1aa]">{item.description || "No description."}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Battle Mode */}
      {activeTab === "battles" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#8b5cf6]" /> Battle Mode Arena
          </h2>

          <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
            <div>
              <label className="text-xs font-mono text-[#a1a1aa] uppercase">Challenge Description</label>
              <input
                type="text"
                value={newChallenge}
                onChange={(e) => setNewChallenge(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Participant Version ID #1</label>
                <input
                  type="text"
                  placeholder="agentVersionId"
                  value={battleAgentA}
                  onChange={(e) => setBattleAgentA(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Participant Version ID #2</label>
                <input
                  type="text"
                  placeholder="agentVersionId"
                  value={battleAgentB}
                  onChange={(e) => setBattleAgentB(e.target.value)}
                  className="w-full mt-1 p-2 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
                />
              </div>
            </div>
            <button
              onClick={handleCreateBattle}
              className="py-2 px-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-mono font-bold rounded"
            >
              Initiate Battle
            </button>
          </div>

          <div className="space-y-3">
            {battles.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Battle #{b.id}</span>
                  <span className="text-emerald-400">{b.status}</span>
                </div>
                <p className="text-xs text-[#a1a1aa]">{b.challenge}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Verification & Badges */}
      {activeTab === "verification" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#8b5cf6]" /> Verification & Badge Attestation
          </h2>

          <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
            <p className="text-xs text-[#a1a1aa]">
              Verification requests run automated security screening suites against exact published AgentVersion artifacts.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleRequestVerification("demo-version-id")}
                className="py-2 px-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-mono rounded"
              >
                Request Security Screening
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Issues & Pull Requests */}
      {activeTab === "collaboration" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#8b5cf6]" /> Repository Issues & Pull Requests
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
              <h3 className="text-xs font-mono text-white font-bold uppercase">Create Issue</h3>
              <input
                type="text"
                placeholder="Issue Title"
                value={newIssueTitle}
                onChange={(e) => setNewIssueTitle(e.target.value)}
                className="w-full p-2 bg-[#09090b] border border-[#27272a] text-xs text-white font-mono rounded"
              />
              <textarea
                placeholder="Issue Body"
                value={newIssueBody}
                onChange={(e) => setNewIssueBody(e.target.value)}
                className="w-full p-2 bg-[#09090b] border border-[#27272a] text-xs text-white font-mono rounded"
              />
              <button
                onClick={handleCreateIssue}
                className="w-full py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-mono font-bold rounded"
              >
                Create Issue (Atomic Numbering)
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a1a1aa] uppercase">Repository Issues List</label>
              <div className="space-y-2">
                {issues.map((iss) => (
                  <div key={iss.id} className="p-3 bg-[#121215] border border-[#27272a] rounded-lg text-xs font-mono">
                    <span className="text-amber-400 font-bold">#{iss.number}</span> {iss.title} ({iss.status})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
