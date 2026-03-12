<template>
  <div class="flex flex-col items-center justify-center h-screen gap-6">
    <div class="relative w-48 h-48">
      <img src="/images/planet.png" class="planet absolute inset-0 w-full h-full" alt="planète" />
      <img src="/images/car.png" class="car absolute inset-0 w-full h-full" alt="voiture" />
    </div>
    <p class="text-sm tracking-widest opacity-70">Chargement...</p>
  </div>
</template>

<style scoped>
.planet {
  animation: rotatePlanet 8s linear infinite;
  transform-origin: center center;
}

.car {
  animation: rotateCar 3s linear infinite;
  transform-origin: center center;
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