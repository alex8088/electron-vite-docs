<template>
  <div class="sponsor-box">
    <h2> 赞助作者 </h2>
    <div class="sponsor-box__bd">
      <div class="sponsor-box__item">
         <img src="/alex.png" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .sponsor-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2.5rem;
    padding: 0 2.5rem;
  }

  .sponsor-box h2 {
    margin: 48px 0 16px;
    border-top: 1px solid var(--vp-c-divider-light);
    padding-top: 24px;
    letter-spacing: -.02em;
    line-height: 32px;
    font-size: 24px;
    opacity: .6;
  }

  .sponsor-box__bd {
    padding-top: 2.5rem;
  }

  .sponsor-box__item img {
    max-width: 320px;
  }
</style>
