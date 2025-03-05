<script setup lang="ts">
const random = Math.floor(Math.random() * 3 + 1)
</script>

<template>
<div class="VPDocAsideSponsors">
  <div class="VPSponsors vp-sponsor aside">
    <section class="vp-sponsor-section">
      <div class="VPSponsorsGrid vp-sponsor-grid mini" data-vp-grid="1">
        <div class="vp-sponsor-grid-item">
          <a class="vp-sponsor-grid-link" href="https://1ms.run?utm_source=electron-vite" target="_blank" rel="sponsored noopener">
            <article class="vp-sponsor-grid-box">
              <h4 class="visually-hidden">毫秒镜像</h4>
              <img style="max-width:33px; border-radius: 2px;" src="/sponsor-3.svg" alt="sponsor-">
              <span class="vp-sponsor-grid-text" style="margin-left: 10px; text-align: center; line-height: 18px; min-width: 85px; font-size: 14px;">毫秒镜像<br/><span style="font-size: 10px;">木雷坞 · MLIEV</span></span>
            </article>
          </a>
        </div>
      </div>
    </section>
    <section class="vp-sponsor-section">
      <div class="VPSponsorsGrid vp-sponsor-grid mini" data-vp-grid="1">
        <div class="vp-sponsor-grid-item">
          <a class="vp-sponsor-grid-link" href="https://dev.boxai.cc/share/14" target="_blank" rel="sponsored noopener">
            <article class="vp-sponsor-grid-box">
              <h4 class="visually-hidden">midjourney 绘画接口服务商</h4>
              <img style="max-width:33px; border-radius: 2px;" src="/sponsor-2.svg" alt="sponsor-1">
              <span class="vp-sponsor-grid-text" style="margin-left: 10px; text-align: center; line-height: 18px;">Midjourney<br/>绘画接口服务商</span>
            </article>
          </a>
        </div>
      </div>
    </section>
    <section class="vp-sponsor-section">
      <div class="VPSponsorsGrid vp-sponsor-grid xmini" data-vp-grid="2">
        <div class="vp-sponsor-grid-item" v-if="random === 1">
          <a class="vp-sponsor-grid-link" href="https://github.com/alex8088/electron-uikit" target="_blank" rel="sponsored noopener">
            <article class="vp-sponsor-grid-box">
              <h4 class="visually-hidden">electron-uikit</h4>
              <img class="vp-sponsor-grid-image" src="/electron-uikit.svg" alt="electron-uikit">
            </article>
          </a>
        </div>
        <div class="vp-sponsor-grid-item" v-if="random === 2">
          <a class="vp-sponsor-grid-link" href="https://github.com/alex8088/electron-conf" target="_blank" rel="sponsored noopener">
            <article class="vp-sponsor-grid-box">
              <h4 class="visually-hidden">electron-conf</h4>
              <img class="vp-sponsor-grid-image" src="/electron-conf.svg" alt="electron-conf">
            </article>
          </a>
        </div>
        <div class="vp-sponsor-grid-item" v-if="random === 3">
          <a class="vp-sponsor-grid-link" href="https://github.com/alex8088/sqlite3-queries" target="_blank" rel="sponsored noopener">
            <article class="vp-sponsor-grid-box">
              <h4 class="visually-hidden">sqlite3-queries</h4>
              <img class="vp-sponsor-grid-image" src="/sqlite3-queries.svg" alt="sqlite3-queries">
            </article>
          </a>
        </div>
        <div class="vp-sponsor-grid-item">
          <a class="vp-sponsor-grid-link" href="/sponsor/" rel="sponsored noopener">
            <article class="vp-sponsor-grid-box">
              <span class="vp-sponsor-grid-text" style="color: var(--vp-c-gray-1);">Your Logo</span>
            </article>
          </a>
        </div>
      </div>
    </section>
  </div>
</div>
</template>

<style>
.vp-sponsor-grid-text {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.dark .vp-sponsor-grid-text {
  color: var(--vp-c-gray-1);
}
</style>
