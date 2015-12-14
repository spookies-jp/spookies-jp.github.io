
var EntryBox = React.createClass({
    getInitialState: function() {
        return {data: []};  // 初期化
    },

    loadAjax: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
                formatBlogEntries();    // ignite.js 記事を整形
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString() );
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadAjax();
    },
    render: function() {
        return (
            <EntryList data={this.state.data} />
        );
    }
});


var EntryList = React.createClass({
    render: function() {
        var entryNodes = this.props.data.map(function(entry) {
            return (
                <Entry entry={entry} key={entry.id} />
            );
        });
        return (
            <div id="posts">
                {entryNodes}
            </div>
        );
    }
});

// cssでやろう
var hrStyle = {
  width: '80%',
  textAlign: 'center',
  margin: 'auto',
  height: '1px'
};

var thumbnailStyle = {
  height: '150px'
};

var Entry = React.createClass({

    formatDate: function(pubDate) {
        var pdate = new Date(pubDate);
        var pday    = pdate.getDate();
        var pmonth  = pdate.getMonth() + 1;
        var pyear   = pdate.getFullYear();
        var phour   = pdate.getHours();
        var pminute = pdate.getMinutes();
        var psecond = pdate.getSeconds();
        return pyear + '年' + pmonth + '月' + pday + '日';
    },

    getImage: function(content) {
        var images = content.match(/<img(.|\s)*?>/gi);
        if (! images) return;

        var imagesURL = [];
        for (var i = 0, l = images.length; i < l; i++) {
            var url = images[i].match(/src=["|'](.*?)["|']/)[1];
            return url;
        }
        return;
    },

    render: function() {
        return (
            <article id={this.props.id} className="post">
                <header>
                    <p className="post-header">
                        <time>{this.formatDate(this.props.entry.published)}</time>
                    </p>
                    <div className="thumbnail"><a href={this.props.entry.link['@attributes'].href}><img style={thumbnailStyle} src={this.getImage(this.props.entry.content)} /></a></div>
                    <h1 className="page-title">
                        <a href={this.props.entry.link['@attributes'].href}>{this.props.entry.title}</a>
                    </h1>
                </header>
                <hr style={hrStyle} />
                <section className="contents">
                    <p>
                        {this.props.entry.summary.substring(0,100)}
                        <a href={this.props.entry.link['@attributes'].href} className="more-link">Read more »</a>
                    </p>
                </section>
            </article>
        );
    }
});

ReactDOM.render(
    <EntryBox url="http://api.spookies.co.jp:8000/hatena.php" />,
    document.getElementById('blog')
);