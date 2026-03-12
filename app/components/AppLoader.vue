<template>
  <div class="loading-screen">
    <div class="planet-system">
      <img src="/images/planet.png" class="planet" alt="planète" />
      <img src="/images/car.png" class="car" alt="voiture" />
    </div>
    <p class="loading-text">Chargement...</p>
  </div>
</template>

<style scoped>
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 24px;
}

.planet-system {
  position: relative;
  width: 200px;
  height: 200px;
}

.planet {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  animation: rotatePlanet 8s linear infinite;
  transform-origin: center center;
}

.car {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  animation: rotateCar 3s linear infinite;
  transform-origin: center center;
}

.loading-text {
  font-size: 1rem;
  letter-spacing: 0.1em;
  opacity: 0.7;
}

@keyframes rotatePlanet {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}

@keyframes rotateCar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>