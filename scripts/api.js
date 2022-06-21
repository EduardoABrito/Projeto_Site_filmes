var api={
    variaveis:{
        apiKey : "api_key=13ff99163faa35496031c4f4d91ae47a",
        baseUrl: "https://api.themoviedb.org/3",
        baseUrlImg: "https://image.tmdb.org/t/p/w500",
        baseLanguage:"language=pt-BR&append_to_response=images&include_image_language=pt",
        pages:1,
        id:[],
    },
    funcoes:{
        detailMoveie:()=>{

        },
        releasesMovies:()=>{
            $("#carrouselFilmes").html("")
            for(let i=0;i<9;i++){
                $.get({
                    url:`${api.variaveis.baseUrl}/movie/${api.variaveis.id[i]}?append_to_response=videos&${api.variaveis.apiKey}`,
                    success:(result)=>{
                        let template = $($("#templateCarrousel").html())
                        template.find(".filmeNome").html(result.title)
                        template.find(".filmeDesc").html(result.overview)
                        template.find(".filmePopularidade").html(result.popularity)
                        template.find(".filmeEstreia").html(result.release_date)
                        template.find(".filmeProducao").html(result?.production_countries[0].name)
                        template.find("iframe").attr("src",`https://www.youtube.com/embed/${result?.videos.results[0].key}`)
                        $("#carrouselFilmes").append(template)
                    }
                }).then(()=>{
                    $($(".carousel-item")[0]).addClass("active") 
                })
            }
        },
        listMovies:(page)=>{
            $.get({
                url:`${api.variaveis.baseUrl}/discover/movie?sort_by=popularity.desc&${api.variaveis.baseLanguage}&${api.variaveis.apiKey}&page=${page}`,
                success:({results})=>{
                   api.funcoes.loadMovies(results)
                }
            }).then(()=>{
                api.funcoes.releasesMovies()
            })
        },
        loadMore:() => {
            api.variaveis.pages++
            $.get({
                url:`${api.variaveis.baseUrl}/discover/movie?sort_by=popularity.desc&${api.variaveis.baseLanguage}&${api.variaveis.apiKey}&page=${api.variaveis.pages}`,
                success:({results})=>{
                    api.funcoes.loadMovies(results)
                }
            })
        },
        loadMovies:(results)=>{
            results.forEach(v => {
                api.variaveis.id.push(v.id)
                let template = $($("#templateFilmes").html())
                template.find(".filmeNome").html(v.original_title)
                template.find(".img-destaques > img").attr("src",`${api.variaveis.baseUrlImg}${v.poster_path}`)
                $("#cardFilmes").append(template)
            })
        },
        searchMovies:()=>{
            $("#pesquisa").on("keyup",function(){
               if(this.value != ""){
                $.get({
                    url:`${api.variaveis.baseUrl}/search/movie?${api.variaveis.baseLanguage}&${api.variaveis.apiKey}&page=${api.variaveis.pages}&query=${this.value}`,
                    success:({results})=>{
                        $("#cardFilmes").html("")
                        api.funcoes.loadMovies(results)
                    }
                })
                return
               }
               api.funcoes.listMovies()
            })
        },
        init:()=>{
            api.funcoes.listMovies()
            api.funcoes.searchMovies()
        }        
    }
}
$(document).ready(api.funcoes.init)