# Metin2 Idle Game - Agent Context

Bu dosya, projeye yeni katılacak AI asistanları (Gemini, Claude vb.) için projenin mimarisini, teknolojilerini ve kurallarını içerir. Lütfen projede çalışmaya başlamadan önce bu dosyayı okuyun.

## 🛠 Teknoloji Yığını (Tech Stack)
- **Frontend**: React (Vite), TypeScript
- **Styling**: Tailwind CSS (Özel Metin2 dark teması - `#0a0a0c`, `#d4af37`, `#8b0000`)
- **State Yönetimi**: Zustand (Multi-store pattern)
- **Kayıt Sistemi**: LocalStorage (Base64 şifreleme ile)

## 📁 Proje Yapısı ve Mimari
Projeyi modüler tutmak için Zustand store'ları parçalara ayrılmıştır ve statik veriler `src/game` altında tutulmaktadır.

- **`src/store/` (State Yönetimi)**
  - `systemStore.ts`: Ana oyun döngüsünü (game loop), çevrimdışı ilerlemeyi (offline progress), save/load işlemlerini yönetir.
  - `playerStore.ts`: Oyuncunun seviyesi, exp, altın, ruh taşı ve hasar statlarını tutar.
  - `combatStore.ts`: Düşman verilerini, aşama (stage) ilerlemesini ve hasar vurma işlemlerini yönetir.
  - `inventoryStore.ts`: Envanter, eşya kuşanma, eşya düşürme, satma ve demirci (blacksmith) işlemlerini yönetir.
  - `artifactStore.ts`: Rebirth sonrası kalıcı güçlendirmeleri yönetir.
- **`src/game/` (Oyun Mantığı ve Statik Veriler)**
  - `math.ts`: Düşman canı, seviye exp ihtiyacı, yükseltme şansları ve maliyetleri için üstel (exponential) ölçekleme formülleri.
  - `items.ts`: Eşya düşürme şansları (Rarity) ve eşya isim havuzu.
- **`src/components/`**: React bileşenleri. Oyuncu statları, dövüş alanı, envanter, demirci ve yeniden doğuş(rebirth) ekranları.
- **`src/utils/numberFormat.ts`**: Artan büyük sayıları (K, M, B, T, vb.) okunabilir formata dönüştüren yardımcı dosya.

## ⚙️ Temel Mekanikler
1. **Çevrimdışı İlerleme (Offline Progress)**: Oyuncu oyuna girmediği süreyi hesaplayarak Auto-DPS üzerinden tahmini hasar ve kazanım (altın/exp) sağlar.
2. **Demirci (Blacksmith)**: Eşyalar +9'a kadar basılabilir. Başarı şansı seviye arttıkça düşer. **Başarısız olursa eşya yok olur.** (Metin2 RNG mantığı).
3. **Rebirth (Yeniden Doğuş)**: 50. seviyede oyuncu her şeyi sıfırlayıp "Spirit Stone" (Ruh Taşı) kazanabilir. Bu taşlar kalıcı Artifact güçlendirmelerinde kullanılır.

---

## 📝 Yapılan Önemli Değişiklikler (Changelog)
*Projeye yeni özellikler eklendiğinde veya büyük değişiklikler yapıldığında projeyi takip edebilmek için lütfen bu listeyi güncelleyin.*

- **[17 Mayıs 2026]**: Proje iskeleti oluşturuldu. Vite + React + TS kurulumu yapıldı. Zustand store yapısı (Player, Combat, Inventory, System, Artifacts) inşa edildi. Metin2 temalı UI ve temel oyun döngüsü (Game Loop) entegre edildi. TypeScript hataları giderildi.
- **[17 Mayıs 2026 - Gelişmiş Düzenlemeler]**: Global ekran kaydırma sorununu çözmek için `100vh` sabit düzen (`h-screen w-screen overflow-hidden`) ve bağımsız kaydırılabilir alanlar uygulandı. index.css üzerinden Metin2 temasına uygun ince altın rengi özel kaydırma çubukları eklendi. Envanter arayüzü; `InventoryPanel`, `InventoryFilter` ve `InventorySlot` şeklinde modüler bileşenlere ayrıştırılarak, yerel filtre durumu yönetimiyle birlikte tab bazlı kategorizasyon (`Tümü`, `Silahlar`, `Zırhlar`, `Kalkanlar`, `Takılar`) eklendi.
