<script setup lang="ts">
import { ref } from 'vue';
import githubIcon from '~/assets/github.svg';
import whatsappIcon from '~/assets/whatsapp.svg';

const websiteUrl = ref('');
const agentsTxtContent = ref(null);
const errorMessage = ref(null);

const checkAgentsTxt = async () => {
  if (!websiteUrl.value.trim()) return;

  try {
    const url = websiteUrl.value.trim();
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const agentsTxtUrl = `${formattedUrl}/agents.txt`;

    const response = await fetch(agentsTxtUrl, { mode: 'no-cors' });

    if (!response.ok) {
      throw new Error('agents.txt not found');
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/plain")) {
      throw new Error('Invalid content type. Expected text/plain.');
    }

    agentsTxtContent.value = await response.text();
    errorMessage.value = null;
  } catch (error) {
    agentsTxtContent.value = null;
    errorMessage.value = error.message;
  }
};
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
        Agent: Example
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
</template>
