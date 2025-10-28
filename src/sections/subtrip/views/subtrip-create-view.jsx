import { SubtripJobCreateView } from './subtrip-job-create-view';

// Backwards-compatible wrapper: route now renders the unified Job Create view
export function SubtripCreateView() {
  return <SubtripJobCreateView />;
}
