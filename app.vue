<script setup lang="ts">
import { ref, onMounted } from 'vue';
import githubIcon from '~/assets/github.svg';
import whatsappIcon from '~/assets/whatsapp.svg';
import normalizeUrl from 'normalize-url';

const supabase = useSupabaseClient();

const websiteUrl = ref('');
const agentsTxtContent = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const storedAgents = ref([]);

// Function to check for agents.txt and store it in Supabase
const checkAgentsTxt = async () => {
  if (!websiteUrl.value.trim()) return;

  try {
    const formattedUrl = normalizeUrl(websiteUrl.value, {
      defaultProtocol: 'https:', // Ensures HTTPS
      stripWWW: true,            // Removes "www."
      removeTrailingSlash: true, // Removes trailing slash
      lowercase: true,           // Converts to lowercase
    });
    const agentsTxtUrl = `${formattedUrl}/agents.txt`;

    const response = await fetch(agentsTxtUrl);

    if (!response.ok) {
      throw new Error('❌ agents.txt not found');
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/plain")) {
      throw new Error('❌ Invalid content type. Expected text/plain.');
    }

    const textContent = await response.text();
    agentsTxtContent.value = textContent;
    errorMessage.value = null;

    // Parse the agents.txt content
    const parsedData = parseAgentsTxt(textContent);
    if (!parsedData) {
      throw new Error("Failed to parse agents.txt");
    }

    // Store agents.txt data in Supabase
    await saveToSupabase(formattedUrl, parsedData);

    // Refresh stored agents
    await fetchStoredAgents();
  } catch (error: any) {
    agentsTxtContent.value = null;
    errorMessage.value = error.message;
  }
};

// Function to parse the agents.txt content
const parseAgentsTxt = (content: string) => {
  const lines = content.split("\n").map(line => line.trim());
  const data: Record<string, string> = {};

  lines.forEach(line => {
    const [key, value] = line.split(":").map(part => part.trim());
    if (key && value) {
      data[key.toLowerCase()] = value; // Normalize keys to lowercase
    }
  });

  if (!data["name"] || !data["description"]) {
    return null; // Ensure mandatory fields are present
  }

  data["logo"] = normalizeUrl(data["logo"], {
    defaultProtocol: 'https:', // Ensures HTTPS
    stripWWW: true,            // Removes "www."
    removeTrailingSlash: true, // Removes trailing slash
    lowercase: true,           // Converts to lowercase
  });

  return {
    name: data["name"],
    logo: data["logo"] ? data["logo"] : "https://agentstxt.dev/favicon.svg",
    description: data["description"],
    api: data["api"] || null,
    communication: data["communication"] || null,
    payment: data["payment"] || null,
  };
};

// Function to insert into Supabase
const saveToSupabase = async (formattedUrl: string, parsedData: any) => {
  const { data, error } = await supabase.from('agents').upsert([
    {
      url: formattedUrl,
      name: parsedData.name,
      logo: parsedData.logo,
      description: parsedData.description,
      api: parsedData.api,
      communication: parsedData.communication,
      payment: parsedData.payment,
    }
  ], { onConflict: ['url'] });
};

// Function to fetch stored agents from Supabase
const fetchStoredAgents = async () => {
  const { data, error } = await supabase.from('agents').select('*');

  if (!error) {
    storedAgents.value = data;
  }
};

// Fetch stored agents on page load
onMounted(fetchStoredAgents);
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center text-center p-8">
    <div class="flex items-end space-x-4">
      <h1 class="text-6xl font-bold text-primary">agents.txt</h1>
      <span class="text-lg text-gray-300">v0.0.1 alpha</span>
    </div>
    <p class="mt-6 text-lg max-w-3xl leading-relaxed">
      We are building an open standard to create a decentralized, democratic <b>Internet of Agents</b>.
      <br>
      Similar to <code>robots.txt</code>, which helps search engines understand website structures,
      <code>agents.txt</code> is a standard that enables AI Agents and B2A (Business to Agent) Services to be
      discovered.
    </p>

    <div class="mt-6 p-4 border border-primary rounded bg-gray-50 text-left max-w-2xl mx-auto">
      <h2 class="text-xl font-bold text-gray-700">Example agents.txt</h2>
      <pre class="whitespace-pre-wrap text-gray-700 text-sm">
        Name: Example
        Logo: https://myai.example.com/logo.png
        Description: AI Agent example
        API: https://myai.example.com/openapi.yaml
        Communication: DID
        Payment: AgentPOS
      </pre>
    </div>

    <p class="mt-6 text-lg max-w-3xl leading-relaxed">
      If you are passionate about shaping the future where AI Agents can collaborate, join us!
    </p>

    <div class="mt-8 flex flex-col sm:flex-row gap-4">
      <a href="https://github.com/dennj/agents.txt" target="_blank" class="btn btn-outline flex items-center gap-2">
        <img :src="githubIcon" alt="GitHub" class="w-5 h-5 filter invert" />
        Contribute on GitHub
      </a>

      <a href="https://chat.whatsapp.com/Ever8ohOJRE3D6r5bLPViQ" target="_blank"
        class="btn btn-success flex items-center gap-2">
        <img :src="whatsappIcon" alt="WhatsApp" class="w-5 h-5" />
        Join the Community
      </a>
    </div>
  </div>

  <section class="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-50">
    <h2 class="text-4xl font-bold text-secondary">Test a Website for agents.txt</h2>
    <p class="mt-2 text-gray-600 max-w-lg">
      Enter a website URL to check if it has an <code>agents.txt</code> file.
    </p>

    <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4 w-full max-w-lg">
      <input v-model="websiteUrl" type="url" placeholder="Enter website URL"
        class="input input-bordered w-full text-gray-700 bg-white border border-secondary rounded-lg px-4 py-2" />
      <button @click="checkAgentsTxt" class="btn btn-secondary text-white">Check</button>
    </div>

    <div class="mt-6 p-4 border border-secondary rounded bg-white text-left w-full max-w-2xl min-h-[200px]">
      <h3 class="text-xl font-bold text-gray-700">agents.txt:</h3>
      <pre class="whitespace-pre-wrap text-gray-700 text-sm overflow-auto max-h-64">
      {{ agentsTxtContent || "Enter a URL and click Check." }}
      </pre>
    </div>

    <div v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</div>
  </section>

  <section class="py-12 px-6 text-center bg-gray-200">
    <h2 class="text-3xl font-bold text-secondary">Known Agents</h2>

    <div v-if="storedAgents.length > 0"
      class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div v-for="agent in storedAgents" :key="agent.id" class="bg-white rounded-lg overflow-hidden p-4">
        <!-- Agent Logo -->
        <div class="flex justify-center">
          <img :src="agent.logo" alt="Agent Logo" class="w-20 h-20 object-cover" />
        </div>

        <!-- Agent Details -->
        <div class="mt-4 text-center">
          <a :href="agent.url" target="_blank" class="text-xl font-bold text-secondary hover:underline">
            {{ agent.name }}
          </a>
          <p class="text-gray-600 mt-2">{{ agent.description }}</p>

          <p v-if="agent.communication" class="text-gray-600 mt-1"><b>Communication:</b> {{ agent.communication }}</p>
          <p v-if="agent.payment" class="text-gray-600 mt-1"><b>Payment:</b> {{ agent.payment }}</p>

          <!-- API Link (if available) -->
          <div v-if="agent.api" class="mt-3">
            <a :href="agent.api" target="_blank" class="text-sm text-secondary font-medium hover:underline">
              View API Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
