<template>
  <section class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-6">
    <div class="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg p-8">
      <h2 class="text-4xl font-bold text-primary text-center mb-6">Agents.txt Builder</h2>

      <!-- FormKit Form -->
      <FormKit type="form" submit-label="Download agents.txt" @submit="downloadAgentsTxt">
        <!-- URL -->
        <FormKit type="url" label="URL (Optional)" placeholder="https://www.example.com" v-model="agent.url"
          validation="url" />

        <!-- Agent Name -->
        <FormKit type="text" label="Agent Name" v-model="agent.name" validation="required" />

        <!-- Logo URL with Fixed Preview Box -->
        <FormKit type="url" label="Logo URL (Optional)" v-model="agent.logo" validation="url"
          placeholder="https://agentstxt.dev/favicon.svg" />
        <p v-if="agent.logo && logoError" class="text-red-500 text-sm absolute">⚠️ Invalid image URL</p>

        <div class="relative flex justify-center mt-2">
          <div class="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-700">
            <img :src="agent.logo" alt="Logo Preview" class="w-full h-full object-contain" @error="logoError = true"
              @load="logoError = false" v-show="agent.logo && !logoError" />
          </div>
        </div>

        <!-- Description -->
        <FormKit type="textarea" label="Description" v-model="agent.description" validation="required" />

        <!-- API URL -->
        <FormKit type="url" label="API URL (Optional)" v-model="agent.api" />

        <!-- Multi-Checkbox for Communication Protocols -->
        <FormKit type="checkbox" label="Supported Communication Protocols" v-model="agent.communication"
          :options="protocols" />

        <!-- Email Validation -->
        <FormKit type="email" label="Author Email" v-model="agent.author" validation="email|required" />

        <!-- Live Preview -->
        <div class="bg-gray-800 dark:bg-gray-700 text-white p-4 mt-6 mb-6 rounded-lg">
          <h2 class="text-lg font-semibold mb-2">Live Preview:</h2>
          <pre class="whitespace-pre-wrap text-sm">{{ agentsTxt }}</pre>
        </div>
      </FormKit>
      
      <!-- Instructional Text -->
      <p class="text-center text-gray-600 dark:text-gray-300 mt-20">
        Install the <code class="font-mono bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">agents.txt</code> 
        file in your website's root directory, then close this page and test it using the test function on the homepage.
      </p>

      <!-- Close Button -->
      <NuxtLink to="/" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-700 transition">
        ⇦ Close
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const agent = ref({
  url: "",
  name: "Example",
  logo: "https://agentstxt.dev/favicon.svg",
  description: "AI Agent example",
  api: "",
  communication: [],
  author: "author@email.ai"
});

const logoError = ref(false);

// Multi-checkbox options
const protocols = ref({ HTML: "HTML", A2Av1: "A2Av1" });

// Automatically prepend "https://" if missing
const ensureUrlProtocol = (url) => {
  return url.length > 7 && !url.startsWith("http://") && !url.startsWith("https://") ? `https://${url}` : url;
};

// Reset the error state
watch(() => agent.value.logo, (newVal) => {
  logoError.value = false;
});

// Watch and format URLs automatically
watch(() => agent.value.url, (newVal) => { agent.value.url = ensureUrlProtocol(newVal); });
watch(() => agent.value.api, (newVal) => { agent.value.api = ensureUrlProtocol(newVal); });

// Generate agents.txt dynamically
const agentsTxt = computed(() => {
  return [
    `Name: ${agent.value.name}`,
    `Description: ${agent.value.description}`,
    agent.value.logo && `Logo: ${agent.value.logo}`,
    agent.value.api && `API: ${agent.value.api}`,
    agent.value.communication.length && `Communication: ${agent.value.communication.join(", ")}`,
    agent.value.author && `Author: ${agent.value.author}`
  ].filter(Boolean).join("\n");
});

// Download agents.txt file
const downloadAgentsTxt = () => {
  const blob = new Blob([agentsTxt.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "agents.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
