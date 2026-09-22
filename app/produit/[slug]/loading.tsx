export default function ProductLoading(){
  return <main className="productLoading" aria-label="Chargement de la fiche produit" role="status">
    <div className="loadingBreadcrumb skeletonLine"/>
    <section>
      <div className="loadingMedia skeletonBlock"><span className="pageLoader"/></div>
      <div className="loadingInfo">
        <span className="skeletonLine short"/>
        <span className="skeletonLine title"/>
        <span className="skeletonLine medium"/>
        <span className="skeletonLine price"/>
        <div className="loadingVariants"><span/><span/><span/><span/></div>
        <span className="loadingButton skeletonBlock"/>
      </div>
    </section>
  </main>
}
