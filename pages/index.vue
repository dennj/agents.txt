<script setup lang="ts">
import { ref, onMounted } from 'vue';
import githubIcon from '~/assets/github.svg';
import emailIcon from '~/assets/email.svg';
import discordIcon from '~/assets/discord.svg';

const supabase = useSupabaseClient();
const storedAgents = ref<Array<{ id: number; name: string; logo: string; description: string; api?: string; communication?: string; author?: string; payment?: string; url: string }>>([]);

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
    <header class="flex items-end space-x-4">
      <h1 class="text-6xl font-bold text-primary">agents.txt</h1>
      <span class="text-lg text-gray-300">v0.0.2 alpha</span>
    </header>

    <p class="mt-6 text-lg max-w-3xl leading-relaxed">
      We are building an open standard to create a decentralized, democratic <b>Internet of Agents</b>.
      <br>
      Similar to <code>robots.txt</code>, which helps search engines understand website structures,
      <code>agents.txt</code> is a standard that enables AI Agents and B2A (Business to Agent) Services to be
      discovered.
    </p>

    <section class="mt-6 p-4 border border-primary rounded bg-gray-50 text-left max-w-2xl mx-auto">
      <h2 class="text-xl font-bold text-gray-700">Example agents.txt</h2>
      <pre class="whitespace-pre-wrap text-gray-700 text-sm">
        Name: Example
        Logo: my.example.com/logo.png
        Description: AI Agent example
        API: my.example.com/openapi.yaml
        Communication: A2Av1
        Author: dennj.osele@gmail.com
      </pre>
    </section>

    <p class="mt-6 text-lg max-w-3xl leading-relaxed">
      If you are passionate about shaping the future where AI Agents can collaborate, join us!
    </p>

    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a href="mailto:dennj.osele@gmail.com"
        class="btn bg-[#1E854A] text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-opacity-80 transition">
        <img :src="emailIcon" alt="Email" class="w-5 h-5 filter invert" draggable="false" />
        Contact Us
      </a>

      <a href="https://github.com/dennj/agents.txt" target="_blank"
        class="btn btn-outline flex items-center gap-2 text-white">
        <img :src="githubIcon" alt="GitHub" class="w-5 h-5 filter invert" draggable="false" />
        Contribute on GitHub
      </a>

      <a href="https://discord.gg/NRNfuaVk"
        class="btn bg-secondary text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#5b6eae] transition">
        <img :src="discordIcon" alt="Discord" class="w-5 h-5 filter invert" draggable="false" />
        Join Discord
      </a>
    </div>

    <section class="mt-12 flex flex-col items-center w-full max-w-6xl">
      <h3 class="text-base font-semibold text-white">Backed by</h3>
      <div class="mt-4 flex space-x-8">
        <NuxtImg src="/images/dpl.avif" alt="DogPatch Labs" class="h-12" draggable="false" />
        <NuxtImg src="/images/ndrc.avif" alt="NDRC" class="h-12" draggable="false" />
      </div>
    </section>
  </div>

  <section class="min-h-screen flex flex-col items-center text-center px-6 bg-gray-50">
    <div class="flex-grow"></div>

    <div class="flex flex-grow h-full items-center justify-center">
      <NuxtLink to="/AgentsTxtBuilder">
        <button class="bg-secondary text-white text-xl px-8 py-4 rounded-lg hover:bg-opacity-80 transition-all">
          Generate agents.txt
        </button>
      </NuxtLink>
    </div>

    <div class="flex-grow flex flex-col items-center justify-center w-full">
      <CheckAgentsTxt />
    </div>

    <div class="flex-grow"></div>
  </section>

  <section class="min-h-screen py-12 px-6 text-center bg-gray-200">
    <h2 class="text-3xl font-bold text-secondary">Known Agents</h2>
    <div v-if="storedAgents.length" class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
          <p v-if="agent.author" class="text-gray-600 mt-1"><b>Author:</b> {{ agent.author }}</p>
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

  <section class="min-h-screen py-12 px-6 text-center bg-gray-900 text-white">
    <h2 class="text-4xl font-bold text-primary">Project Long-Term Goals</h2>
    <div class="mt-4 max-w-3xl mx-auto text-gray-300">
      <h3 class="text-2xl font-semibold">Our mission is to build the <b>Internet of Agents</b>.</h3>

      <p class="mt-4 leading-relaxed">
        Hardware prices continue to decrease in line with Moore's Law, and open-source models now compete with OpenAI’s
        latest offerings.
        With market barriers disappearing, the real bottleneck is <b>data</b>. <br>
        As many companies hold domain-specific datasets, the immediate future will see the rise of numerous
        domain-expert agents interacting with both human and AI agents.
      </p>

      <p class="mt-6 leading-relaxed">Here are our long-term goals:</p>
    </div>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
      <!-- Goal 1 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-green-900 text-white rounded-full text-xl font-bold flex-shrink-0">
          1
        </div>
        <div>
          <h3 class="text-lg font-bold">Agents Discovery 🤖</h3>
          <p class="text-gray-600">
            Establish a standardized <code>agents.txt</code> file that enables AI Agents and Business-to-Agent APIs to
            be easily discovered.
          </p>
        </div>
      </div>

      <!-- Goal 2 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-green-700 text-white rounded-full text-xl font-bold flex-shrink-0">
          2
        </div>
        <div>
          <h3 class="text-lg font-bold">Agent Search Engine 🔎</h3>
          <p class="text-gray-600">
            Build a search engine to help users and other AI agents find and connect with AI Agents.
          </p>
        </div>
      </div>

      <!-- Goal 3 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-teal-600 text-white rounded-full text-xl font-bold flex-shrink-0">
          3</div>
        <div>
          <h3 class="text-lg font-bold">A2A Communication Protocol 🔗</h3>
          <p class="text-gray-600">
            Design a protocol for direct agent messaging, negotiation, and collaboration.
          </p>
        </div>
      </div>

      <!-- Goal 4 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-blue-500 text-white rounded-full text-xl font-bold flex-shrink-0">
          4</div>
        <div>
          <h3 class="text-lg font-bold">Agent Authentication 🔑</h3>
          <p class="text-gray-600">
            Create a secure authentication system for AI Agents and to access personal data on behalf of users.
          </p>
        </div>
      </div>

      <!-- Goal 5 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-full text-xl font-bold flex-shrink-0">
          5
        </div>
        <div>
          <h3 class="text-lg font-bold">Agent Rating System ⭐</h3>
          <p class="text-gray-600">
            Allow AI agents to review other agents to improve service quality and avoid scams.
          </p>
        </div>
      </div>

      <!-- Goal 6 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-purple-600 text-white rounded-full text-xl font-bold flex-shrink-0">
          6</div>
        <div>
          <h3 class="text-lg font-bold">A2A Payment System 💰</h3>
          <p class="text-gray-600">
            Develop a decentralized payment system that enables Agent-to-Agent transactions.
          </p>
        </div>
      </div>

      <!-- Goal 7 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-purple-800 text-white rounded-full text-xl font-bold flex-shrink-0">
          7
        </div>
        <div>
          <h3 class="text-lg font-bold">Automate Invoices & Reconciliation 🧾</h3>
          <p class="text-gray-600">
            Implement an automated invoicing system that integrates with the agent payment system.
          </p>
        </div>
      </div>

      <!-- Goal 8 -->
      <div class="flex items-start space-x-4 p-6 bg-white text-gray-800 rounded-lg">
        <div
          class="w-7 h-14 flex items-center justify-center bg-red-500 text-white rounded-full text-xl font-bold flex-shrink-0">
          8
        </div>
        <div>
          <h3 class="text-lg font-bold">Watch Internet of Agents Explode 🚀</h3>
          <p class="text-gray-600">
            Once these components are in place, the Internet of Agents will thrive, revolutionizing the world.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="flex flex-col items-center justify-center text-center px-6 py-12 bg-black">
    <p class="mt-4 text-lg max-w-3xl leading-relaxed text-gray-300">
      Join us!
    </p>

    <div class="mt-8 flex flex-col sm:flex-row gap-6">
      <a href="mailto:dennj.osele@gmail.com"
        class="btn bg-[#1E854A]  text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-opacity-80 transition">
        <img :src="emailIcon" alt="Email" class="w-5 h-5 filter invert" draggable="false" />
        Contact Us
      </a>

      <a href="https://github.com/dennj/agents.txt" target="_blank" class="btn btn-outline flex items-center gap-2">
        <img :src="githubIcon" alt="GitHub" class="w-5 h-5 filter invert" draggable="false" />
        Contribute on GitHub
      </a>

      <a href="https://discord.gg/NRNfuaVk"
        class="btn bg-secondary text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#5b6eae] transition">
        <img :src="discordIcon" alt="Email" class="w-5 h-5 filter invert" draggable="false" />
        Join Discord
      </a>
    </div>
  </section>
</template>
