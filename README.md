# MaMoMusic 官方网站

> 一个播放器，听遍全网音乐。

MaMoMusic 是基于 **Wails v3**（Go 后端 + Vue 3 前端）打造的跨平台桌面音乐播放器，
聚合 **酷狗概念版 / 网易云音乐 / 酷我音乐** 三大平台曲库。本仓库是 MaMoMusic 的官方介绍站点（GitHub Pages）。

## 特性亮点

- 多平台曲库聚合，一站搜索与播放
- 全屏逐字歌词，支持 0.75×–2.0× 倍速
- 3D 粒子主题（Sonic Grid 音浪地形），磨砂玻璃随模糊度调节
- Live2D 看板娘 · 桌面歌词透明窗 · 律动可视化
- 自建歌单与云端同步（酷狗概念版 / 网易云），「我喜欢」红心收藏
- 原平台评论流，支持「查看 N 条回复」逐楼展开
- 每日推荐、歌手 A–Z 分组、本地音乐导入

## 技术栈

Wails v3 · Go · Vue 3 · TypeScript

## 本地预览

```bash
# 任意静态服务器即可，例如：
python -m http.server 8080
# 然后访问 http://localhost:8080
```

站点为纯静态资源（`index.html` + `assets/`），可直接托管于 GitHub Pages / Vercel / Netlify。

---

© 2026 MaMoMusic · Built with Wails v3 + Vue 3
