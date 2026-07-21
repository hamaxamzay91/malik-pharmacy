import { useLang } from '../context/index.jsx'
export default function MedicinesPage() {
  const { t } = useLang()
  return <div style={{padding:40}}><h1 style={{color:'var(--text-primary)'}}>دەرمانەکان — بەزووی دێت</h1></div>
}
