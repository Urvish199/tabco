import ProductList from "./ProductList";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const id = await params?.id
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList catalogId={id} />
    </Suspense>
  );
}
