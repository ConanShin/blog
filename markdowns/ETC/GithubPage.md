Github Page
===

- 기본적으로 gh-pages 브랜치나 특정 브랜치의 docs폴더에 있는
  static 컨텐츠를 기반으로 호스팅을 하게 되며
  url은 https://[github ID].github.io/[project name] 형식이 됩니다.
  
- 간혹 public path에 있는 리소스를 찾지 못하는 경우가 있습니다.
  ![](https://i.imgur.com/qBXnghA.png)
  그럴 때는 3가지를 확인해 주시면 됩니다.
  1. Webpack config의 public path
  2. package.json의 homepage 필드
  3. react-router나 vue-router의 baseUrl
  저는 위 3가지 항목을 relative path인 `./`로 셋팅해줍니다.

- 그리고 나서 githubpage의 setting에서
  ![](https://i.imgur.com/GdV2TaJ.png)
  위 항목을 설정해 주면 page가 호스팅되는것을 확인할 수 있습니다.
  
- !주의
  1. private 패키지는 호스팅하는데 과금이 있습니다.
  2. dns셋팅시 public폴더 밑에 CNAME파일을 생성하여 안에 domain정보를 넣어주시면 됩니다.
