import json
import os
import sys

from src.html_templates import div_template


def read_json(json_path: str):
    assert os.path.exists(
        json_path
    ), f"Given path {json_path} does not exist. Did you send the right path?"

    with open(json_path, "r") as json_file:
        json_obj = json.load(json_file)

    print(json_obj)
    return json_obj


def write_json(data: dict, json_path: str):
    with open(json_path, "w") as json_file:
        json.dump(data, json_file)


def autogenerate_div(userName: str, data: dict):
    div = div_template.format(
        data["img_avatar_link"], userName, userName, data["description"], data["subscribers"]
    )
    return div

def get_inside_body(inside_body: str):
    return "<body>" + inside_body + "</body>\n"


def remove_body_if_it_exists(html_path: str):
    with open(html_path, 'r') as html_file:
        lines = html_file.readlines()

    body_start_idx = -1
    for idx, line in enumerate(lines):
        if '<body>' in line:
            body_start_idx = idx

    if body_start_idx != -1:
        with open(html_path, 'w+') as html_file:
            html_file.write("".join(lines[:body_start_idx]))


def write_to_html(html_path: str, data: str):
    remove_body_if_it_exists(html_path)
    with open(html_path, 'a') as html_file:
        html_file.write(data)
        html_file.write('</html>')


if __name__ == "__main__":
    if len(sys.argv) > 2:
        json_path = sys.argv[1]
    else:
        json_path = "list_users.json"

    obj_json = read_json(json_path)
    div = """<div class="grid-container">"""
    for youtuberUserName, youtuberData in obj_json.items():
        div += autogenerate_div(youtuberUserName, youtuberData)
    div += "</div>"

    body = get_inside_body(div)
    print("This is the output body:\n ", body)

    write_to_html("index.html", body)
