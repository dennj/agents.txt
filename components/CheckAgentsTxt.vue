<script setup lang="ts">
import { ref } from 'vue';
import normalizeUrl from 'normalize-url';

const supabase = useSupabaseClient();

const websiteUrl = ref('');
const agentsTxtContent = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// Function to check for agents.txt and store it in Supabase
const checkAgentsTxt = async () => {
  if (!websiteUrl.value.trim()) return;

  try {
    const formattedUrl = normalizeUrl(websiteUrl.value, {
      defaultProtocol: 'https', // Ensures HTTPS
      stripWWW: true,            // Removes "www."
      removeTrailingSlash: true, // Removes trailing slash
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
  } catch (error: any) {
    agentsTxtContent.value = null;
    console.error(error.message);
    errorMessage.value = "No file agents.txt found in this domain.";
  }
};

// Function to parse the agents.txt content
const parseAgentsTxt = (content: string) => {
  const lines = content.split("\n").map(line => line.trim());
  const data: Record<string, string> = {};

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(":"); // Ensures only the first ":" is split
    if (!key || valueParts.length === 0) return;

    const value = valueParts.join(":").trim(); // Rejoins remaining parts for URLs
    if (key && value) {
      data[key.toLowerCase()] = value; // Normalize keys to lowercase
    }
  });

  if (!data["name"] || !data["description"]) {
    return null; // Ensure mandatory fields are present
  }

  // Normalize logo URL safely
  if (data["logo"]) {
    data["logo"] = normalizeUrl(data["logo"], {
      defaultProtocol: 'https',
      stripWWW: true,
      removeTrailingSlash: true,
    });
  }
  else {
    data["logo"] = "https://agentstxt.dev/favicon.svg"
  }

  return {
    name: data["name"],
    logo: data["logo"],
    description: data["description"],
    api: data["api"] || null,
    communication: data["communication"] || null,
    author: data["author"] || null,
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
      author: parsedData.author,
      payment: parsedData.payment,
    }
  ], { onConflict: ['url'] });
};
</script>

<template>
  <h2 class="text-4xl font-bold text-secondary">Test a Website for agents.txt</h2>
  <p class="mt-2 text-gray-600 max-w-lg">Enter a website URL to check if it has an <code>agents.txt</code> file.</p>

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
</template>
