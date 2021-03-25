Http Requester
===

###### tags: `flutter`

- Dependency
    ```yaml
    dependencies:
        http: ^0.13.1 # latest version
    ```
    
- Data Object
    ```java
    class Post {
      final int userId;
      final int id;
      final String title;
      final String body;

      Post({this.userId, this.id, this.title, this.body});

      factory Post.fromJson(Map<String, dynamic> json) {
        return Post(
          userId: json['userId'],
          id: json['id'],
          title: json['title'],
          body: json['body'],
        );
      }
    }
    ```

- Http Requester & DTO transform
    ```java
    import 'package:has_admin/auxilary/post.dto.dart';
    import 'dart:convert';
    import 'package:http/http.dart' as http;

    class PostRequester {
      Future<List<Post>> fetchPost() async {
        http.Response response = await http.get(
            Uri.parse('https://jsonplaceholder.typicode.com/posts'),
            headers: {"Accept": "application/json"});
        if (response.statusCode == 200) {
          return json.decode(response.body).map<Post>((post) => Post.fromJson(post)).toList();
        } else {
          throw Exception('Failed to load post');
        }
      }
    }
    ```

- Widget
    ```java
    class _HomePageState extends State<HomePage> {
      String get title => 'Home Page';
      Future<List<Post>> posts;
      PostRequester requester = new PostRequester();

      @override
      void initState() {
        super.initState();
        posts = requester.fetchPost();
      }

      @override
      Widget build(context) {
        return Center(
          child: FutureBuilder<List<Post>>(
            future: posts,
            builder: (context, snapshot) {
              return ListView.builder(
                itemCount: snapshot.data.length,
                itemBuilder: (context, index) {
                  Post post = snapshot.data[index];
                  return Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: Text(post.title)
                      ),
                      Expanded(
                        flex: 7,
                        child: Text(post.body)
                      )
                    ],
                  );
                },
              );
            }
          )
        );
      }
    }
    ```