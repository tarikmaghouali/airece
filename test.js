import Vapi from '@vapi-ai/web';
console.log(Vapi);
try {
  let v = new Vapi('f0313a9e-90be-4b09-b1cb-3b18ab82fb12');
  console.log(v);
} catch (e) {
  console.error("error", e);
}
