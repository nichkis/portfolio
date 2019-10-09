from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/viz-sort')
def sort():
    return render_template("viz-sorting.html")

@app.route('/viz-geo')
def geo():
    return render_template("viz-geo.html")

@app.route('/viz-geo/<filename>')
def data(filename):
    print(filename);
    return app.send_static_file("data/"+filename);

if __name__ == "__main__":
    app.run(debug=True)
