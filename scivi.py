#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, send_from_directory

from server.server import SciViServer
from onto.onto import Onto


app = Flask(__name__, static_url_path="")
srv = None

@app.route("/")
@app.route("/index.html")
@app.route("/csv")
def csv_page():
    global srv
    srv = SciViServer(Onto("kb/csv/csv.merged.ont"), None)
    return send_from_directory("client", "editor.html")

@app.route("/scivi-editor-main.js")
def editor_main():
    global srv
    return srv.get_editor_js()

@app.route("/scivi-editor-dependencies.js")
def editor_deps():
    global srv
    return srv.get_editor_dependencies_js()

@app.route("/css/scivi-editor-dependencies.css")
def editor_deps_css():
    global srv
    return srv.get_editor_dependencies_css()

@app.route("/scivi-sockets.css")
def editor_sockets_css():
    global srv
    return srv.get_editor_css()

@app.route("/css/<path:filename>")
def editor_css(filename):
    return send_from_directory("client/css", filename)

@app.route("/lib/<path:filename>")
def editor_lib(filename):
    return send_from_directory("client/lib", filename)